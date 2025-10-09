import { db } from '../config/db.js';
import { coursesTable } from '../config/schema.js';

const starterCourses = [
  {
    cid: 'html-css-js-basics',
    name: 'HTML, CSS & JavaScript Fundamentals',
    description: 'Learn the building blocks of web development with HTML, CSS, and JavaScript. Perfect for beginners who want to start their web development journey.',
    category: 'Web Development',
    level: 'beginner',
    noOfChapters: 8,
    includeVideo: true,
    isPublished: true,
    userEmail: 'mohameddacarmohumed@gmail.com',
    courseJson: {
      chapters: [
        {
          name: 'Introduction to Web Development',
          duration: '45 minutes',
          topics: ['What is web development', 'How websites work', 'Tools you need']
        },
        {
          name: 'HTML Basics',
          duration: '2 hours',
          topics: ['HTML structure', 'Common HTML tags', 'Forms and inputs']
        },
        {
          name: 'CSS Styling',
          duration: '3 hours',
          topics: ['CSS selectors', 'Box model', 'Flexbox and Grid']
        },
        {
          name: 'JavaScript Fundamentals',
          duration: '4 hours',
          topics: ['Variables and data types', 'Functions', 'DOM manipulation']
        },
        {
          name: 'Building Your First Website',
          duration: '3 hours',
          topics: ['Project setup', 'Creating a portfolio', 'Deployment']
        }
      ],
      price: 29.99,
      isFree: false,
      videoSource: 'youtube'
    }
  },
  {
    cid: 'react-tailwind-complete',
    name: 'ReactJS & Tailwind CSS Complete Guide',
    description: 'Master modern React development with Tailwind CSS. Build beautiful, responsive web applications with the latest React features and best practices.',
    category: 'Web Development',
    level: 'intermediate',
    noOfChapters: 12,
    includeVideo: true,
    isPublished: true,
    userEmail: 'mohameddacarmohumed@gmail.com',
    courseJson: {
      chapters: [
        {
          name: 'React Fundamentals',
          duration: '2 hours',
          topics: ['Components and JSX', 'Props and State', 'Event handling']
        },
        {
          name: 'Hooks and State Management',
          duration: '3 hours',
          topics: ['useState and useEffect', 'Custom hooks', 'Context API']
        },
        {
          name: 'Tailwind CSS Introduction',
          duration: '2 hours',
          topics: ['Utility-first CSS', 'Responsive design', 'Custom components']
        },
        {
          name: 'Building Real Projects',
          duration: '6 hours',
          topics: ['E-commerce site', 'Dashboard application', 'Portfolio website']
        }
      ],
      price: 49.99,
      isFree: false,
      videoSource: 'youtube'
    }
  },
  {
    cid: 'react-native-mobile',
    name: 'React Native Mobile Development',
    description: 'Learn to build cross-platform mobile applications using React Native. Create iOS and Android apps with a single codebase.',
    category: 'Mobile Development',
    level: 'intermediate',
    noOfChapters: 10,
    includeVideo: true,
    isPublished: true,
    userEmail: 'mohameddacarmohumed@gmail.com',
    courseJson: {
      chapters: [
        {
          name: 'React Native Setup',
          duration: '1 hour',
          topics: ['Environment setup', 'Expo vs CLI', 'First app']
        },
        {
          name: 'Core Components',
          duration: '3 hours',
          topics: ['View, Text, Image', 'ScrollView and FlatList', 'Touchable components']
        },
        {
          name: 'Navigation',
          duration: '2 hours',
          topics: ['React Navigation', 'Stack and Tab navigation', 'Deep linking']
        },
        {
          name: 'State Management',
          duration: '2 hours',
          topics: ['Redux in React Native', 'AsyncStorage', 'Context API']
        }
      ],
      price: 39.99,
      isFree: false,
      videoSource: 'youtube'
    }
  },
  {
    cid: 'fullstack-web-dev',
    name: 'Full-Stack Web Development',
    description: 'Complete full-stack development course covering frontend, backend, and database technologies. Build production-ready web applications.',
    category: 'Web Development',
    level: 'advanced',
    noOfChapters: 15,
    includeVideo: true,
    isPublished: true,
    userEmail: 'mohameddacarmohumed@gmail.com',
    courseJson: {
      chapters: [
        {
          name: 'Frontend Technologies',
          duration: '4 hours',
          topics: ['React, Vue, Angular', 'State management', 'Testing']
        },
        {
          name: 'Backend Development',
          duration: '5 hours',
          topics: ['Node.js and Express', 'RESTful APIs', 'Authentication']
        },
        {
          name: 'Database Design',
          duration: '3 hours',
          topics: ['SQL and NoSQL', 'Database relationships', 'Query optimization']
        },
        {
          name: 'Deployment and DevOps',
          duration: '3 hours',
          topics: ['Docker and containers', 'Cloud deployment', 'CI/CD']
        }
      ],
      price: 79.99,
      isFree: false,
      videoSource: 'youtube'
    }
  },
  {
    cid: 'python-programming',
    name: 'Python Programming Masterclass',
    description: 'Learn Python from basics to advanced concepts. Perfect for beginners and those looking to advance their Python skills for web development, data science, and automation.',
    category: 'Programming',
    level: 'beginner',
    noOfChapters: 14,
    includeVideo: true,
    isPublished: true,
    userEmail: 'mohameddacarmohumed@gmail.com',
    courseJson: {
      chapters: [
        {
          name: 'Python Basics',
          duration: '2 hours',
          topics: ['Variables and data types', 'Control structures', 'Functions']
        },
        {
          name: 'Object-Oriented Programming',
          duration: '3 hours',
          topics: ['Classes and objects', 'Inheritance', 'Polymorphism']
        },
        {
          name: 'Web Development with Django',
          duration: '4 hours',
          topics: ['Django framework', 'Models and views', 'Templates']
        },
        {
          name: 'Data Science with Python',
          duration: '3 hours',
          topics: ['Pandas and NumPy', 'Data visualization', 'Machine learning basics']
        }
      ],
      price: 34.99,
      isFree: false,
      videoSource: 'youtube'
    }
  }
];

async function seedCourses() {
  try {
    console.log('Seeding starter courses...');
    
    for (const course of starterCourses) {
      await db.insert(coursesTable).values(course);
      console.log(`Created course: ${course.name}`);
    }
    
    console.log('All starter courses created successfully!');
  } catch (error) {
    console.error('Error seeding courses:', error);
  }
}

seedCourses();
