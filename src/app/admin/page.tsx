'use client';

import { useState } from 'react';
import { Lock, User, Key, LayoutDashboard, Image, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminProfileManager from '@/components/admin/AdminProfileManager';
import AdminPortfolioManager from '@/components/admin/AdminPortfolioManager';
import AdminSettingsManager from '@/components/admin/AdminSettingsManager';

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  // 管理员登录验证
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // 从环境变量读取管理员凭证
    const adminUsername = process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';

    if (username === adminUsername && password === adminPassword) {
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('用户名或密码错误');
    }
  };

  // 退出登录
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  // 未登录状态 - 显示登录表单
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-950 to-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="border-red-900/50 bg-black/60 backdrop-blur-xl">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-red-600/20 rounded-full">
                <Lock className="w-8 h-8 text-red-500" />
              </div>
              <CardTitle className="text-2xl text-red-500 font-bold">后台管理系统</CardTitle>
              <CardDescription className="text-gray-400">
                请输入管理员凭证以继续
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-gray-300">
                    <User className="w-4 h-4 inline mr-2" />
                    用户名
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="请输入用户名"
                    className="bg-black/50 border-red-900/50 focus:border-red-500 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-300">
                    <Key className="w-4 h-4 inline mr-2" />
                    密码
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="请输入密码"
                    className="bg-black/50 border-red-900/50 focus:border-red-500 text-white"
                    required
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                >
                  登录
                </Button>

                <div className="text-center text-xs text-gray-500 mt-4">
                  默认账号：admin / admin123
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // 已登录状态 - 显示后台管理界面
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-950 to-gray-900">
      {/* 顶部导航栏 */}
      <header className="border-b border-red-900/30 bg-black/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-600/20 rounded-lg">
                <LayoutDashboard className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">后台管理</h1>
                <p className="text-xs text-gray-400">欢迎回来，{username}</p>
              </div>
            </div>

            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-red-900/50 text-red-500 hover:bg-red-600/20"
            >
              退出登录
            </Button>
          </div>
        </div>
      </header>

      {/* 主要内容区域 */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-black/40 border border-red-900/30">
            <TabsTrigger
              value="profile"
              className="data-[state=active]:bg-red-600 data-[state=active]:text-white"
            >
              <User className="w-4 h-4 mr-2" />
              个人名片
            </TabsTrigger>
            <TabsTrigger
              value="portfolio"
              className="data-[state=active]:bg-red-600 data-[state=active]:text-white"
            >
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <Image className="w-4 h-4 mr-2" />
              作品集管理
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-red-600 data-[state=active]:text-white"
            >
              <Settings className="w-4 h-4 mr-2" />
              网站设置
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <AdminProfileManager />
          </TabsContent>

          <TabsContent value="portfolio" className="mt-6">
            <AdminPortfolioManager />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <AdminSettingsManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
