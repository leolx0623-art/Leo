'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PersonalInfo {
  name: string;
  title: string;
  avatar: string;
  location: string;
  email: string;
  phone: string;
  github: string;
  twitter: string;
  linkedin: string;
  douyin: string;
  xiaohongshu: string;
  bilibili: string;
  weixin: string;
}

interface Experience {
  id: string;
  year: string;
  position: string;
  company: string;
  location: string;
  description: string;
}

interface SkillCategory {
  id: string;
  name: string;
  icon: string;
  skills: string[];
}

interface ProfileData {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  skillCategories: SkillCategory[];
}

interface ProfileEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: ProfileData;
  onSave: (data: ProfileData) => void;
}

export function ProfileEditor({ open, onOpenChange, initialData, onSave }: ProfileEditorProps) {
  const [data, setData] = useState<ProfileData>(initialData);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const handleSave = () => {
    onSave(data);
    onOpenChange(false);
  };

  const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
    setData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const addExperience = () => {
    setData(prev => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        {
          id: Date.now().toString(),
          year: '',
          position: '',
          company: '',
          location: '',
          description: ''
        }
      ]
    }));
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    setData(prev => ({
      ...prev,
      experiences: prev.experiences.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const deleteExperience = (id: string) => {
    setData(prev => ({
      ...prev,
      experiences: prev.experiences.filter(exp => exp.id !== id)
    }));
  };

  const addSkill = (categoryId: string, skill: string) => {
    setData(prev => ({
      ...prev,
      skillCategories: prev.skillCategories.map(cat =>
        cat.id === categoryId
          ? { ...cat, skills: [...cat.skills, skill] }
          : cat
      )
    }));
  };

  const removeSkill = (categoryId: string, skillIndex: number) => {
    setData(prev => ({
      ...prev,
      skillCategories: prev.skillCategories.map(cat =>
        cat.id === categoryId
          ? {
              ...cat,
              skills: cat.skills.filter((_, i) => i !== skillIndex)
            }
          : cat
      )
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-2xl font-bold">编辑个人名片</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="personal" className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal">基本信息</TabsTrigger>
            <TabsTrigger value="experience">专业履历</TabsTrigger>
            <TabsTrigger value="skills">技能专长</TabsTrigger>
          </TabsList>

          {/* 基本信息 */}
          <TabsContent value="personal" className="flex-1 overflow-hidden">
            <ScrollArea className="h-[60vh] pr-4">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">姓名 *</Label>
                    <Input
                      id="name"
                      value={data.personalInfo.name}
                      onChange={(e) => updatePersonalInfo('name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">职业头衔 *</Label>
                    <Input
                      id="title"
                      value={data.personalInfo.title}
                      onChange={(e) => updatePersonalInfo('title', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="avatar">头像 Emoji 或 URL</Label>
                  <Input
                    id="avatar"
                    value={data.personalInfo.avatar}
                    onChange={(e) => updatePersonalInfo('avatar', e.target.value)}
                    placeholder="例如：👨‍💻 或 https://..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">现住地</Label>
                    <Input
                      id="location"
                      value={data.personalInfo.location}
                      onChange={(e) => updatePersonalInfo('location', e.target.value)}
                      placeholder="例如：中国 · 北京"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">邮箱</Label>
                    <Input
                      id="email"
                      type="email"
                      value={data.personalInfo.email}
                      onChange={(e) => updatePersonalInfo('email', e.target.value)}
                      placeholder="leo@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">电话</Label>
                  <Input
                    id="phone"
                    value={data.personalInfo.phone}
                    onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                    placeholder="+86 138 **** ****"
                  />
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <Label>社交媒体链接</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="github" className="text-sm">GitHub</Label>
                      <Input
                        id="github"
                        value={data.personalInfo.github}
                        onChange={(e) => updatePersonalInfo('github', e.target.value)}
                        placeholder="用户名或链接"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="twitter" className="text-sm">Twitter</Label>
                      <Input
                        id="twitter"
                        value={data.personalInfo.twitter}
                        onChange={(e) => updatePersonalInfo('twitter', e.target.value)}
                        placeholder="用户名或链接"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="linkedin" className="text-sm">LinkedIn</Label>
                      <Input
                        id="linkedin"
                        value={data.personalInfo.linkedin}
                        onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                        placeholder="用户名或链接"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="douyin" className="text-sm">🎵 抖音</Label>
                      <Input
                        id="douyin"
                        value={data.personalInfo.douyin}
                        onChange={(e) => updatePersonalInfo('douyin', e.target.value)}
                        placeholder="抖音号或主页链接"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="xiaohongshu" className="text-sm">📕 小红书</Label>
                      <Input
                        id="xiaohongshu"
                        value={data.personalInfo.xiaohongshu}
                        onChange={(e) => updatePersonalInfo('xiaohongshu', e.target.value)}
                        placeholder="小红书号或主页链接"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bilibili" className="text-sm">📺 B站</Label>
                      <Input
                        id="bilibili"
                        value={data.personalInfo.bilibili}
                        onChange={(e) => updatePersonalInfo('bilibili', e.target.value)}
                        placeholder="B站UID或主页链接"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weixin" className="text-sm">💬 微信 / 视频号</Label>
                      <Input
                        id="weixin"
                        value={data.personalInfo.weixin}
                        onChange={(e) => updatePersonalInfo('weixin', e.target.value)}
                        placeholder="微信号或视频号名称"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          {/* 专业履历 */}
          <TabsContent value="experience" className="flex-1 overflow-hidden">
            <ScrollArea className="h-[60vh] pr-4">
              <div className="space-y-6">
                {data.experiences.map((exp, index) => (
                  <div key={exp.id} className="p-4 rounded-lg border bg-card">
                    <div className="flex justify-between items-start mb-4 pt-4">
                      <h4 className="font-semibold">工作经历 {index + 1}</h4>
                      {data.experiences.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteExperience(exp.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>时间</Label>
                        <Input
                          value={exp.year}
                          onChange={(e) => updateExperience(exp.id, 'year', e.target.value)}
                          placeholder="2023 - 至今"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>职位</Label>
                        <Input
                          value={exp.position}
                          onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                          placeholder="AIGC 创作者"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label>公司</Label>
                        <Input
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                          placeholder="自由职业"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>地点</Label>
                        <Input
                          value={exp.location}
                          onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                          placeholder="远程"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 mt-4">
                      <Label>描述</Label>
                      <Textarea
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                        placeholder="简要描述你的工作内容和成就"
                        rows={3}
                      />
                    </div>
                  </div>
                ))}

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={addExperience}
                >
                  <Plus className="mr-2 w-4 h-4" />
                  添加工作经历
                </Button>
              </div>
            </ScrollArea>
          </TabsContent>

          {/* 技能专长 */}
          <TabsContent value="skills" className="flex-1 overflow-hidden">
            <ScrollArea className="h-[60vh] pr-4">
              <div className="space-y-6">
                {data.skillCategories.map((category) => (
                  <div key={category.id} className="p-4 rounded-lg border bg-card">
                    <div className="flex items-center gap-2 mb-4 pt-4">
                      <span className="text-xl">{category.icon}</span>
                      <Label className="text-base">{category.name}</Label>
                    </div>

                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {category.skills.map((skill, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="px-3 py-1 flex items-center gap-1"
                          >
                            {skill}
                            <button
                              onClick={() => removeSkill(category.id, index)}
                              className="ml-1 hover:text-destructive"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Input
                          placeholder={`添加${category.name.split(' ')[0]}技能...`}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                              addSkill(category.id, e.currentTarget.value.trim());
                              e.currentTarget.value = '';
                            }
                          }}
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={(e) => {
                            const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                            if (input?.value.trim()) {
                              addSkill(category.id, input.value.trim());
                              input.value = '';
                            }
                          }}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleSave} className="bg-gradient-to-r from-purple-500 to-pink-500">
            保存更改
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
