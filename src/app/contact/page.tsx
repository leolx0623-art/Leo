'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation } from '@/components/navigation';
import { Mail, Phone, MapPin, Download, MessageSquare, ExternalLink } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [guestbookMessages, setGuestbookMessages] = useState([
    { id: 1, name: 'Alex Chen', message: 'Amazing portfolio! Love the cyberpunk aesthetic.', date: '2024-01-15' },
    { id: 2, name: 'Sarah Lee', message: 'Your AI-generated art is incredible. Would love to collaborate!', date: '2024-01-14' },
    { id: 3, name: 'Mike Zhang', message: 'Great work on the video projects. Very inspiring!', date: '2024-01-13' },
  ]);
  const [guestbookInput, setGuestbookInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert('Message sent successfully! I will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  const handleGuestbookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestbookInput.trim()) return;

    const newMessage = {
      id: Date.now(),
      name: 'Guest',
      message: guestbookInput,
      date: new Date().toISOString().split('T')[0],
    };

    setGuestbookMessages([newMessage, ...guestbookMessages]);
    setGuestbookInput('');
  };

  const downloadResume = () => {
    // Simulate resume download
    alert('Resume download started! (This would download a PDF in production)');
    // In production, this would track analytics and download the actual file
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-green-950/20">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Get in Touch
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have a project in mind? Let's create something amazing together!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-green-500/20 shadow-2xl shadow-green-500/10">
              <CardHeader className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border-b">
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-6 h-6 text-green-400" />
                  Send a Message
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Name</label>
                    <Input
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email</label>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Subject</label>
                    <Input
                      placeholder="Project inquiry, collaboration, etc."
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Message</label>
                    <Textarea
                      placeholder="Tell me about your project..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      className="min-h-[120px]"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Resume Download */}
            <Card className="border-purple-500/20 shadow-xl shadow-purple-500/10">
              <CardHeader className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-b">
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-6 h-6 text-purple-400" />
                  Resume
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-muted-foreground mb-4">
                  Download my full resume to learn more about my experience and skills.
                </p>
                <Button
                  onClick={downloadResume}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Resume
                </Button>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  234 downloads
                </p>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-green-400" />
                  <span>hello@aigccreator.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-blue-400" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-purple-400" />
                  <span>San Francisco, CA</span>
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card>
              <CardHeader>
                <CardTitle>Follow Me</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 flex-wrap">
                  <Button variant="outline" size="sm" asChild>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Twitter
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      LinkedIn
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      GitHub
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Instagram
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Guestbook */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-blue-500/20 shadow-2xl shadow-blue-500/10">
            <CardHeader className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-b">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-blue-400" />
                Guestbook
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleGuestbookSubmit} className="mb-6">
                <div className="flex gap-2">
                  <Input
                    placeholder="Leave a message..."
                    value={guestbookInput}
                    onChange={(e) => setGuestbookInput(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  >
                    Post
                  </Button>
                </div>
              </form>

              <div className="space-y-4">
                {guestbookMessages.map((msg) => (
                  <div key={msg.id} className="border-l-2 border-blue-500/50 pl-4 py-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold">{msg.name}</span>
                      <span className="text-xs text-muted-foreground">{msg.date}</span>
                    </div>
                    <p className="text-muted-foreground">{msg.message}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
