'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Settings, Save, RefreshCw, Mail, Bot, Database } from 'lucide-react';

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  enableContactForm: boolean;
  enableAiChat: boolean;
  contactEmail: string;
  aiPersona: string;
}

export default function AdminSettingsManager() {
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: '',
    siteDescription: '',
    enableContactForm: true,
    enableAiChat: true,
    contactEmail: '',
    aiPersona: '',
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('加载设置失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setMessage('设置保存成功！');
      } else {
        setMessage('保存失败，请重试');
      }
    } catch (error) {
      setMessage('保存失败，请重试');
      console.error('保存失败:', error);
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleChange = (field: keyof SiteSettings, value: any) => {
    setSettings(prev => ({
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
          <Settings className="w-5 h-5" />
          网站设置
        </CardTitle>
        <CardDescription className="text-gray-400">
          配置网站的基本信息和功能开关
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 基本信息 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white border-b border-red-900/30 pb-2">
            基本信息
          </h3>

          <div className="space-y-2">
            <Label htmlFor="siteName" className="text-gray-300">
              网站名称 *
            </Label>
            <Input
              id="siteName"
              value={settings.siteName}
              onChange={(e) => handleChange('siteName', e.target.value)}
              placeholder="例如：我的个人网站"
              className="bg-black/50 border-red-900/50 focus:border-red-500 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="siteDescription" className="text-gray-300">
              网站描述
            </Label>
            <Textarea
              id="siteDescription"
              value={settings.siteDescription}
              onChange={(e) => handleChange('siteDescription', e.target.value)}
              placeholder="请输入网站描述"
              rows={3}
              className="bg-black/50 border-red-900/50 focus:border-red-500 text-white"
            />
          </div>
        </div>

        {/* 功能开关 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white border-b border-red-900/30 pb-2">
            功能开关
          </h3>

          <div className="flex items-center justify-between p-4 bg-black/40 border border-red-900/30 rounded-lg">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-red-500" />
              <div>
                <div className="text-white font-medium">联系表单</div>
                <div className="text-sm text-gray-400">
                  允许访客通过联系表单发送留言
                </div>
              </div>
            </div>
            <Switch
              checked={settings.enableContactForm}
              onCheckedChange={(checked) =>
                handleChange('enableContactForm', checked)
              }
              className="data-[state=checked]:bg-red-600"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-black/40 border border-red-900/30 rounded-lg">
            <div className="flex items-center gap-3">
              <Bot className="w-5 h-5 text-red-500" />
              <div>
                <div className="text-white font-medium">AI 数字分身</div>
                <div className="text-sm text-gray-400">
                  允许访客与 AI 数字分身互动
                </div>
              </div>
            </div>
            <Switch
              checked={settings.enableAiChat}
              onCheckedChange={(checked) =>
                handleChange('enableAiChat', checked)
              }
              className="data-[state=checked]:bg-red-600"
            />
          </div>
        </div>

        {/* 联系设置 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white border-b border-red-900/30 pb-2">
            联系设置
          </h3>

          <div className="space-y-2">
            <Label htmlFor="contactEmail" className="text-gray-300">
              联系邮箱 *
            </Label>
            <Input
              id="contactEmail"
              type="email"
              value={settings.contactEmail}
              onChange={(e) => handleChange('contactEmail', e.target.value)}
              placeholder="contact@example.com"
              className="bg-black/50 border-red-900/50 focus:border-red-500 text-white"
              required
            />
            <p className="text-xs text-gray-500">
              留言将发送到此邮箱
            </p>
          </div>
        </div>

        {/* AI 设置 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white border-b border-red-900/30 pb-2">
            AI 数字分身设置
          </h3>

          <div className="space-y-2">
            <Label htmlFor="aiPersona" className="text-gray-300">
              AI 人设描述
            </Label>
            <Textarea
              id="aiPersona"
              value={settings.aiPersona}
              onChange={(e) => handleChange('aiPersona', e.target.value)}
              placeholder="描述 AI 的性格、专业领域等"
              rows={4}
              className="bg-black/50 border-red-900/50 focus:border-red-500 text-white"
            />
            <p className="text-xs text-gray-500">
              例如：你是一位专业的全栈开发工程师，擅长 React、Node.js 和 AI 应用开发
            </p>
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
            {saving ? '保存中...' : '保存设置'}
          </Button>

          <Button
            onClick={loadSettings}
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
