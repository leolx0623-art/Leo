'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, MapPin, Github, Linkedin, Mail, Save, RefreshCw } from 'lucide-react';

interface ProfileData {
  name: string;
  title: string;
  bio: string;
  location: string;
  email: string;
  github: string;
  linkedin: string;
  avatar: string;
}

export default function AdminProfileManager() {
  const [profile, setProfile] = useState<ProfileData>({
    name: '',
    title: '',
    bio: '',
    location: '',
    email: '',
    github: '',
    linkedin: '',
    avatar: '',
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // 加载个人名片数据
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (error) {
      console.error('加载个人名片失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        setMessage('个人名片保存成功！');
      } else {
        setMessage('保存失败，请重试');
      }
    } catch (error) {
      setMessage('保存失败，请重试');
      console.error('保存失败:', error);
    } finally {
      setSaving(false);

      // 3秒后清除消息
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleChange = (field: keyof ProfileData, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-red-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <Card className="border-red-900/50 bg-black/60 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-xl text-red-500 flex items-center gap-2">
          <User className="w-5 h-5" />
          个人名片管理
        </CardTitle>
        <CardDescription className="text-gray-400">
          编辑您的个人信息和联系方式，这些信息将显示在网站首页
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 基本信息 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white border-b border-red-900/30 pb-2">
            基本信息
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">
                姓名 *
              </Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="请输入姓名"
                className="bg-black/50 border-red-900/50 focus:border-red-500 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-300">
                职位/头衔 *
              </Label>
              <Input
                id="title"
                value={profile.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="例如：全栈开发工程师"
                className="bg-black/50 border-red-900/50 focus:border-red-500 text-white"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="text-gray-300">
              个人简介 *
            </Label>
            <Textarea
              id="bio"
              value={profile.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              placeholder="请输入个人简介"
              rows={4}
              className="bg-black/50 border-red-900/50 focus:border-red-500 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-gray-300">
              <MapPin className="w-4 h-4 inline mr-1" />
              所在地
            </Label>
            <Input
              id="location"
              value={profile.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="例如：上海"
              className="bg-black/50 border-red-900/50 focus:border-red-500 text-white"
            />
          </div>
        </div>

        {/* 头像设置 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white border-b border-red-900/30 pb-2">
            头像设置
          </h3>

          <div className="space-y-2">
            <Label htmlFor="avatar" className="text-gray-300">
              头像 URL
            </Label>
            <Input
              id="avatar"
              value={profile.avatar}
              onChange={(e) => handleChange('avatar', e.target.value)}
              placeholder="请输入头像图片的 URL"
              className="bg-black/50 border-red-900/50 focus:border-red-500 text-white"
            />
            {profile.avatar && (
              <div className="mt-2">
                <p className="text-sm text-gray-400 mb-2">头像预览：</p>
                <img
                  src={profile.avatar}
                  alt="头像预览"
                  className="w-20 h-20 rounded-full object-cover border-2 border-red-500"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* 联系方式 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white border-b border-red-900/30 pb-2">
            联系方式
          </h3>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">
              <Mail className="w-4 h-4 inline mr-1" />
              邮箱
            </Label>
            <Input
              id="email"
              type="email"
              value={profile.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="your.email@example.com"
              className="bg-black/50 border-red-900/50 focus:border-red-500 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="github" className="text-gray-300">
              <Github className="w-4 h-4 inline mr-1" />
              GitHub
            </Label>
            <Input
              id="github"
              value={profile.github}
              onChange={(e) => handleChange('github', e.target.value)}
              placeholder="https://github.com/username"
              className="bg-black/50 border-red-900/50 focus:border-red-500 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedin" className="text-gray-300">
              <Linkedin className="w-4 h-4 inline mr-1" />
              LinkedIn
            </Label>
            <Input
              id="linkedin"
              value={profile.linkedin}
              onChange={(e) => handleChange('linkedin', e.target.value)}
              placeholder="https://linkedin.com/in/username"
              className="bg-black/50 border-red-900/50 focus:border-red-500 text-white"
            />
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-4 pt-4">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? '保存中...' : '保存更改'}
          </Button>

          <Button
            onClick={loadProfile}
            disabled={loading}
            variant="outline"
            className="border-red-900/50 text-red-500 hover:bg-red-600/20"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            重新加载
          </Button>
        </div>

        {message && (
          <div className={`p-3 rounded-lg text-sm ${
            message.includes('成功')
              ? 'bg-green-500/20 border border-green-500/50 text-green-400'
              : 'bg-red-500/20 border border-red-500/50 text-red-400'
          }`}>
            {message}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
