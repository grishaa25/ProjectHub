export interface ChatMessage {
  id: string;
  sender: {
    name: string;
    avatar: string;
    role: 'student' | 'mentor';
  };
  content: string;
  timestamp: string;
}

export const chatData: Record<string, ChatMessage[]> = {
  'ai-healthcare': [
    {
      id: '1',
      sender: {
        name: 'Dr. Emily Rodriguez',
        avatar: '/placeholder.svg',
        role: 'mentor'
      },
      content: "Welcome everyone! Let's discuss the AI diagnostic model architecture.",
      timestamp: '2025-05-07T10:00:00Z'
    },
    {
      id: '2',
      sender: {
        name: 'David Kim',
        avatar: '/placeholder.svg',
        role: 'student'
      },
      content: "I've been researching different CNN architectures we could use. Should we use ResNet or EfficientNet as our base?",
      timestamp: '2025-05-07T10:05:00Z'
    }
  ],
  'smart-campus': [
    {
      id: '1',
      sender: {
        name: 'Alex Turner',
        avatar: '/placeholder.svg',
        role: 'student'
      },
      content: 'Just pushed the initial IoT sensor code to our repository.',
      timestamp: '2025-05-07T09:00:00Z'
    },
    {
      id: '2',
      sender: {
        name: 'Sarah Lee',
        avatar: '/placeholder.svg',
        role: 'student'
      },
      content: "Great! I'll review the code and test it with our hardware setup.",
      timestamp: '2025-05-07T09:15:00Z'
    }
  ],
  'eco-transport': [
    {
      id: '1',
      sender: {
        name: 'Prof. James Wilson',
        avatar: '/placeholder.svg',
        role: 'mentor'
      },
      content: 'The emission tracking algorithm looks promising. Any thoughts on improving accuracy?',
      timestamp: '2025-05-07T11:00:00Z'
    }
  ]
}
