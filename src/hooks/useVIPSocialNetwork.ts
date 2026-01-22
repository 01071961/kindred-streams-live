import { useState, useEffect, useCallback } from 'react';
import { externalSupabase } from '@/integrations/supabase/externalClient';
import { useAuth } from '@/auth';
import { toast } from 'sonner';

interface SocialProfile {
  id: string;
  userId: string;
  name: string;
  avatarUrl: string;
  tier: string;
  isCreator: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
}

interface SocialPost {
  id: string;
  authorId: string;
  title: string;
  content: string;
  category: string;
  imageUrl?: string;
  likesCount: number;
  commentsCount: number;
  isPinned: boolean;
  createdAt: string;
  author?: SocialProfile;
}

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention';
  message: string;
  read: boolean;
  createdAt: string;
  actorId: string;
  actorName: string;
  postId?: string;
}

export function useVIPSocialNetwork() {
  const { user } = useAuth();
  const [myProfile, setMyProfile] = useState<SocialProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [followingIds, setFollowingIds] = useState<Set<string>>(new Set());
  const [likedPostIds, setLikedPostIds] = useState<Set<string>>(new Set());

  const fetchMyProfile = useCallback(async () => {
    if (!user) return;

    try {
      const { data: affiliate } = await externalSupabase
        .from('vip_affiliates')
        .select('id, tier, is_creator, user_id')
        .eq('user_id', user.id)
        .eq('status', 'approved')
        .single();

      if (!affiliate) {
        setLoading(false);
        return;
      }

      const affiliateData = affiliate as any;

      const { data: profile } = await externalSupabase
        .from('profiles')
        .select('name, avatar_url, followers_count, following_count')
        .eq('user_id', user.id)
        .single();

      const profileData = profile as any;

      // Count posts
      const { count: postsCount } = await externalSupabase
        .from('affiliate_posts')
        .select('*', { count: 'exact', head: true })
        .eq('author_id', affiliateData.id);

      setMyProfile({
        id: affiliateData.id,
        userId: affiliateData.user_id,
        name: profileData?.name || user.email?.split('@')[0] || 'Afiliado',
        avatarUrl: profileData?.avatar_url || '',
        tier: affiliateData.tier || 'bronze',
        isCreator: affiliateData.is_creator || false,
        followersCount: profileData?.followers_count || 0,
        followingCount: profileData?.following_count || 0,
        postsCount: postsCount || 0
      });

      // Load following list
      const { data: following } = await externalSupabase
        .from('affiliate_follows')
        .select('following_id')
        .eq('follower_id', affiliateData.id);

      const followingData = (following || []) as any[];
      setFollowingIds(new Set(followingData.map(f => f.following_id)));

      // Load liked posts
      const { data: likes } = await externalSupabase
        .from('affiliate_post_likes')
        .select('post_id')
        .eq('affiliate_id', affiliateData.id)
        .not('post_id', 'is', null);

      const likesData = (likes || []) as any[];
      setLikedPostIds(new Set(likesData.map(l => l.post_id!)));
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchMyProfile();
  }, [fetchMyProfile]);

  const followUser = async (affiliateId: string) => {
    if (!myProfile) return false;

    try {
      if (followingIds.has(affiliateId)) {
        await externalSupabase
          .from('affiliate_follows')
          .delete()
          .eq('follower_id', myProfile.id)
          .eq('following_id', affiliateId);

        setFollowingIds(prev => {
          const next = new Set(prev);
          next.delete(affiliateId);
          return next;
        });
        toast.success('Deixou de seguir');
      } else {
        await externalSupabase
          .from('affiliate_follows')
          .insert({
            follower_id: myProfile.id,
            following_id: affiliateId
          } as any);

        setFollowingIds(prev => new Set(prev).add(affiliateId));
        toast.success('Seguindo!');
      }
      return true;
    } catch (error) {
      console.error('Error toggling follow:', error);
      toast.error('Erro ao atualizar seguimento');
      return false;
    }
  };

  const likePost = async (postId: string) => {
    if (!myProfile) return false;

    try {
      if (likedPostIds.has(postId)) {
        await externalSupabase
          .from('affiliate_post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('affiliate_id', myProfile.id);

        setLikedPostIds(prev => {
          const next = new Set(prev);
          next.delete(postId);
          return next;
        });
      } else {
        await externalSupabase
          .from('affiliate_post_likes')
          .insert({
            post_id: postId,
            affiliate_id: myProfile.id
          } as any);

        setLikedPostIds(prev => new Set(prev).add(postId));
      }
      return true;
    } catch (error) {
      console.error('Error toggling like:', error);
      return false;
    }
  };

  const createPost = async (data: { title: string; content: string; category: string; imageUrl?: string }) => {
    if (!myProfile) {
      toast.error('Você precisa ser afiliado para publicar');
      return null;
    }

    try {
      const { data: post, error } = await externalSupabase
        .from('affiliate_posts')
        .insert({
          author_id: myProfile.id,
          title: data.title,
          content: data.content,
          category: data.category,
          image_url: data.imageUrl
        } as any)
        .select()
        .single();

      if (error) throw error;

      toast.success('Publicação criada!');
      return post;
    } catch (error: any) {
      console.error('Error creating post:', error);
      toast.error('Erro ao criar publicação: ' + error.message);
      return null;
    }
  };

  const editPost = async (postId: string, title: string, content: string) => {
    if (!myProfile) {
      toast.error('Você precisa ser afiliado para editar');
      return null;
    }

    try {
      const { data: post, error } = await externalSupabase
        .from('affiliate_posts')
        .update({
          title: title.trim() || null,
          content: content.trim(),
          updated_at: new Date().toISOString()
        } as any)
        .eq('id', postId)
        .eq('author_id', myProfile.id)
        .select()
        .single();

      if (error) throw error;

      toast.success('Publicação atualizada!');
      return post;
    } catch (error: any) {
      console.error('Error updating post:', error);
      toast.error('Erro ao atualizar publicação: ' + error.message);
      return null;
    }
  };

  const addComment = async (postId: string, content: string) => {
    if (!myProfile || !content.trim()) return null;

    try {
      const { data: comment, error } = await externalSupabase
        .from('affiliate_post_comments')
        .insert({
          post_id: postId,
          author_id: myProfile.id,
          content: content.trim()
        } as any)
        .select()
        .single();

      if (error) throw error;

      return comment;
    } catch (error: any) {
      console.error('Error adding comment:', error);
      toast.error('Erro ao comentar');
      return null;
    }
  };

  const deletePost = async (postId: string) => {
    if (!myProfile) {
      toast.error('Você precisa ser afiliado para excluir');
      return false;
    }

    try {
      // First delete related likes
      await externalSupabase
        .from('affiliate_post_likes')
        .delete()
        .eq('post_id', postId);

      // Delete related comments
      await externalSupabase
        .from('affiliate_post_comments')
        .delete()
        .eq('post_id', postId);

      // Delete the post
      const { error } = await externalSupabase
        .from('affiliate_posts')
        .delete()
        .eq('id', postId)
        .eq('author_id', myProfile.id);

      if (error) throw error;

      toast.success('Publicação excluída!');
      return true;
    } catch (error: any) {
      console.error('Error deleting post:', error);
      toast.error('Erro ao excluir publicação: ' + error.message);
      return false;
    }
  };

  const isFollowing = (affiliateId: string) => followingIds.has(affiliateId);
  const hasLiked = (postId: string) => likedPostIds.has(postId);

  return {
    myProfile,
    loading,
    followUser,
    likePost,
    createPost,
    editPost,
    deletePost,
    addComment,
    isFollowing,
    hasLiked,
    refresh: fetchMyProfile
  };
}
