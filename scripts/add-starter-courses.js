// Simple script to add starter courses via API calls
const courses = [
  {
    name: 'HTML, CSS & JavaScript Fundamentals',
    description: 'Learn the building blocks of web development with HTML, CSS, and JavaScript. Perfect for beginners who want to start their web development journey.',
    category: 'Web Development',
    level: 'beginner',
    price: 29.99,
    isFree: false,
    includeVideo: true,
    videoSource: 'youtube',
    chapters: [
      {
        name: 'Introduction to Web Development',
        duration: '45 minutes',
        description: 'Learn the basics of web development',
        topics: ['What is web development', 'How websites work', 'Tools you need']
      },
      {
        name: 'HTML Basics',
        duration: '2 hours',
        description: 'Master HTML structure and tags',
        topics: ['HTML structure', 'Common HTML tags', 'Forms and inputs']
      },
      {
        name: 'CSS Styling',
        duration: '3 hours',
        description: 'Style your web pages with CSS',
        topics: ['CSS selectors', 'Box model', 'Flexbox and Grid']
      },
      {
        name: 'JavaScript Fundamentals',
        duration: '4 hours',
        description: 'Add interactivity with JavaScript',
        topics: ['Variables and data types', 'Functions', 'DOM manipulation']
      },
      {
        name: 'Building Your First Website',
        duration: '3 hours',
        description: 'Create a complete website project',
        topics: ['Project setup', 'Creating a portfolio', 'Deployment']
      }
    ]
  },
  {
    name: 'ReactJS & Tailwind CSS Complete Guide',
    description: 'Master modern React development with Tailwind CSS. Build beautiful, responsive web applications with the latest React features and best practices.',
    category: 'Web Development',
    level: 'intermediate',
    price: 49.99,
    isFree: false,
    includeVideo: true,
    videoSource: 'youtube',
    chapters: [
      {
        name: 'React Fundamentals',
        duration: '2 hours',
        description: 'Learn React basics and components',
        topics: ['Components and JSX', 'Props and State', 'Event handling']
      },
      {
        name: 'Hooks and State Management',
        duration: '3 hours',
        description: 'Master React hooks and state',
        topics: ['useState and useEffect', 'Custom hooks', 'Context API']
      },
      {
        name: 'Tailwind CSS Introduction',
        duration: '2 hours',
        description: 'Style with utility-first CSS',
        topics: ['Utility-first CSS', 'Responsive design', 'Custom components']
      },
      {
        name: 'Building Real Projects',
        duration: '6 hours',
        description: 'Create production-ready applications',
        topics: ['E-commerce site', 'Dashboard application', 'Portfolio website']
      }
    ]
  },
  {
    name: 'React Native Mobile Development',
    description: 'Learn to build cross-platform mobile applications using React Native. Create iOS and Android apps with a single codebase.',
    category: 'Mobile Development',
    level: 'intermediate',
    price: 39.99,
    isFree: false,
    includeVideo: true,
    videoSource: 'youtube',
    chapters: [
      {
        name: 'React Native Setup',
        duration: '1 hour',
        description: 'Set up your development environment',
        topics: ['Environment setup', 'Expo vs CLI', 'First app']
      },
      {
        name: 'Core Components',
        duration: '3 hours',
        description: 'Learn React Native components',
        topics: ['View, Text, Image', 'ScrollView and FlatList', 'Touchable components']
      },
      {
        name: 'Navigation',
        duration: '2 hours',
        description: 'Implement app navigation',
        topics: ['React Navigation', 'Stack and Tab navigation', 'Deep linking']
      },
      {
        name: 'State Management',
        duration: '2 hours',
        description: 'Manage app state effectively',
        topics: ['Redux in React Native', 'AsyncStorage', 'Context API']
      }
    ]
  },
  {
    name: 'Full-Stack Web Development',
    description: 'Complete full-stack development course covering frontend, backend, and database technologies. Build production-ready web applications.',
    category: 'Web Development',
    level: 'advanced',
    price: 79.99,
    isFree: false,
    includeVideo: true,
    videoSource: 'youtube',
    chapters: [
      {
        name: 'Frontend Technologies',
        duration: '4 hours',
        description: 'Master modern frontend frameworks',
        topics: ['React, Vue, Angular', 'State management', 'Testing']
      },
      {
        name: 'Backend Development',
        duration: '5 hours',
        description: 'Build robust backend services',
        topics: ['Node.js and Express', 'RESTful APIs', 'Authentication']
      },
      {
        name: 'Database Design',
        duration: '3 hours',
        description: 'Design and optimize databases',
        topics: ['SQL and NoSQL', 'Database relationships', 'Query optimization']
      },
      {
        name: 'Deployment and DevOps',
        duration: '3 hours',
        description: 'Deploy and maintain applications',
        topics: ['Docker and containers', 'Cloud deployment', 'CI/CD']
      }
    ]
  },
  {
    name: 'Python Programming Masterclass',
    description: 'Learn Python from basics to advanced concepts. Perfect for beginners and those looking to advance their Python skills for web development, data science, and automation.',
    category: 'Programming',
    level: 'beginner',
    price: 34.99,
    isFree: false,
    includeVideo: true,
    videoSource: 'youtube',
    chapters: [
      {
        name: 'Python Basics',
        duration: '2 hours',
        description: 'Learn Python fundamentals',
        topics: ['Variables and data types', 'Control structures', 'Functions']
      },
      {
        name: 'Object-Oriented Programming',
        duration: '3 hours',
        description: 'Master OOP concepts in Python',
        topics: ['Classes and objects', 'Inheritance', 'Polymorphism']
      },
      {
        name: 'Web Development with Django',
        duration: '4 hours',
        description: 'Build web apps with Django',
        topics: ['Django framework', 'Models and views', 'Templates']
      },
      {
        name: 'Data Science with Python',
        duration: '3 hours',
        description: 'Analyze data with Python',
        topics: ['Pandas and NumPy', 'Data visualization', 'Machine learning basics']
      }
    ]
  }
];

console.log('Starter courses data ready. Use the admin panel to add these courses manually.');
console.log('Or run: npm run dev and visit /admin to add courses through the interface.');

// Export for potential use
export { courses };
