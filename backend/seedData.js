// Sample data seeder - Run this to populate database with dummy data
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Course = require('./models/Course');
const Progress = require('./models/Progress');

function makeCertificateId() {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `CERT-${Date.now()}-${rand}`;
}

const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    interests: ['Web Development', 'Data Science'],
    experienceLevel: 'Advanced',
    currentStreak: 12,
    longestStreak: 18,
    lastLoginAt: new Date()
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'john123',
    role: 'student',
    interests: ['Web Development', 'Mobile Development'],
    experienceLevel: 'Beginner',
    currentStreak: 3,
    longestStreak: 6,
    lastLoginAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'jane123',
    role: 'student',
    interests: ['Data Science', 'Machine Learning'],
    experienceLevel: 'Intermediate',
    currentStreak: 7,
    longestStreak: 10,
    lastLoginAt: new Date()
  },
  {
    name: 'Alex Johnson',
    email: 'alex@example.com',
    password: 'alex123',
    role: 'student',
    interests: ['Cloud Computing', 'Cybersecurity'],
    experienceLevel: 'Advanced',
    currentStreak: 15,
    longestStreak: 22,
    lastLoginAt: new Date()
  },
  {
    name: 'Maria Garcia',
    email: 'maria@example.com',
    password: 'maria123',
    role: 'student',
    interests: ['Web Development', 'Data Science', 'Machine Learning'],
    experienceLevel: 'Intermediate',
    currentStreak: 0,
    longestStreak: 5,
    lastLoginAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    name: 'David Kim',
    email: 'david@example.com',
    password: 'david123',
    role: 'student',
    interests: ['Mobile Development', 'Web Development'],
    experienceLevel: 'Beginner',
    currentStreak: 1,
    longestStreak: 3,
    lastLoginAt: new Date()
  },
  {
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    password: 'sarah123',
    role: 'student',
    interests: ['Data Science', 'Cloud Computing'],
    experienceLevel: 'Advanced',
    currentStreak: 9,
    longestStreak: 14,
    lastLoginAt: new Date()
  },
  {
    name: 'Tom Anderson',
    email: 'tom@example.com',
    password: 'tom123',
    role: 'student',
    interests: ['Cybersecurity', 'Cloud Computing'],
    experienceLevel: 'Intermediate',
    currentStreak: 4,
    longestStreak: 8,
    lastLoginAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
  },
  {
    name: 'Emily Brown',
    email: 'emily@example.com',
    password: 'emily123',
    role: 'student',
    interests: ['Machine Learning', 'Data Science'],
    experienceLevel: 'Beginner',
    currentStreak: 2,
    longestStreak: 4,
    lastLoginAt: new Date()
  },
  {
    name: 'Priya Nair',
    email: 'priya@example.com',
    password: 'priya123',
    role: 'student',
    interests: ['DevOps', 'Cloud Computing'],
    experienceLevel: 'Intermediate',
    currentStreak: 5,
    longestStreak: 9,
    lastLoginAt: new Date()
  },
  {
    name: 'Arun Kumar',
    email: 'arun@example.com',
    password: 'arun123',
    role: 'student',
    interests: ['Cybersecurity', 'Data Science'],
    experienceLevel: 'Beginner',
    currentStreak: 2,
    longestStreak: 5,
    lastLoginAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    name: 'Nisha Patel',
    email: 'nisha@example.com',
    password: 'nisha123',
    role: 'student',
    interests: ['Web Development', 'Mobile Development'],
    experienceLevel: 'Advanced',
    currentStreak: 11,
    longestStreak: 16,
    lastLoginAt: new Date()
  }
];

const sampleCourses = [
  {
    title: 'Complete Web Development Bootcamp',
    description: 'Learn HTML, CSS, JavaScript and modern web development from scratch',
    category: 'Web Development',
    difficulty: 'Beginner',
    duration: '40 hours',
    instructor: 'Prof. Michael Johnson',
    modules: [
      {
        title: 'Introduction to HTML',
        description: 'Learn HTML basics and structure',
        duration: '3 hours',
        content: `Welcome to HTML Fundamentals!

HTML (HyperText Markup Language) is the standard markup language for creating web pages. It defines the structure and content of web documents.

**Key Concepts:**

1. HTML Elements:
   - HTML uses tags to mark up content
   - Most tags come in pairs: opening <tag> and closing </tag>
   - Example: <p>This is a paragraph</p>

2. Basic Document Structure:
   <!DOCTYPE html>
   <html>
     <head>
       <title>Page Title</title>
     </head>
     <body>
       <h1>Main Heading</h1>
       <p>Paragraph content</p>
     </body>
   </html>

3. Common HTML Tags:
   - Headings: <h1> to <h6> (h1 is largest)
   - Paragraphs: <p>
   - Links: <a href="url">Link Text</a>
   - Images: <img src="image.jpg" alt="description">
   - Lists: <ul> (unordered), <ol> (ordered), <li> (list items)
   - Div: <div> (container for grouping elements)
   - Span: <span> (inline container)

4. Attributes:
   - Provide additional information about elements
   - Common attributes: id, class, src, href, alt, style
   - Example: <div id="header" class="main-header">

**Practice:** Try creating a simple HTML page with a heading, paragraph, and a link!`,
        quiz: [
          {
            question: 'What does HTML stand for?',
            options: ['HyperText Markup Language', 'HighText Machine Language', 'Hyperlink and Text Markup Language', 'Home Tool Markup Language'],
            correctIndex: 0
          },
          {
            question: 'Which tag is used for the largest heading?',
            options: ['<h6>', '<heading>', '<h1>', '<head>'],
            correctIndex: 2
          },
          {
            question: 'Which attribute is used to provide a unique id?',
            options: ['class', 'id', 'name', 'key'],
            correctIndex: 1
          }
        ],
        order: 1
      },
      {
        title: 'Styling with CSS',
        description: 'Master CSS for beautiful designs',
        duration: '4 hours',
        content: `CSS (Cascading Style Sheets) - Making Websites Beautiful!

CSS is used to style and layout web pages. It controls colors, fonts, spacing, and positioning.

**CSS Selectors:**

1. Element Selector: p { color: blue; }
2. Class Selector: .card { padding: 20px; }
3. ID Selector: #header { background: white; }
4. Descendant: div p { margin: 10px; }

**Common CSS Properties:**

- Colors: color, background-color
- Text: font-size, font-weight, text-align
- Box Model: margin, padding, border
- Display: display, position, float

**Flexbox Layout:**
Flexbox is perfect for 1-dimensional layouts (rows or columns).

.container {
  display: flex;
  justify-content: center;  /* Horizontal alignment */
  align-items: center;      /* Vertical alignment */
  gap: 20px;                /* Space between items */
}

**CSS Grid:**
Grid is ideal for 2-dimensional layouts (rows AND columns).

.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;  /* 3 equal columns */
  grid-gap: 20px;
}

**Box Model:**
Every element has: Content → Padding → Border → Margin

**Best Practices:**
- Use classes for reusable styles
- Keep specificity low
- Use meaningful class names
- Organize your CSS logically

**Tip:** Practice by recreating designs you see online!`,
        quiz: [
          {
            question: 'Which property changes text color?',
            options: ['font-style', 'color', 'text-color', 'background-color'],
            correctIndex: 1
          },
          {
            question: 'Which layout system is 2D (rows + columns)?',
            options: ['Flexbox', 'Grid', 'Float', 'Table'],
            correctIndex: 1
          },
          {
            question: 'How do you select a class named card in CSS?',
            options: ['#card', '.card', 'card()', '@card'],
            correctIndex: 1
          }
        ],
        order: 2
      },
      {
        title: 'JavaScript Fundamentals',
        description: 'Learn JavaScript programming',
        duration: '5 hours',
        content: `JavaScript - Adding Interactivity to Web Pages!

JavaScript is a programming language that makes websites interactive and dynamic.

**Variables:**

1. let - for variables that can change:
   let count = 0;
   count = count + 1;

2. const - for constants that don't change:
   const PI = 3.14159;

3. var - old way (avoid in modern code)

**Data Types:**
- String: "hello" or 'world'
- Number: 42, 3.14
- Boolean: true, false
- Array: [1, 2, 3, 4]
- Object: { name: "John", age: 30 }
- null, undefined

**Functions:**
Reusable blocks of code:

function greet(name) {
  return "Hello, " + name + "!";
}

const greet = (name) => "Hello, " + name + "!";  // Arrow function

**Arrays:**
Lists of values:

const fruits = ['apple', 'banana', 'orange'];
fruits.push('grape');        // Add to end
fruits.length;               // Get length
fruits[0];                   // Access first item

**Objects:**
Key-value pairs:

const person = {
  name: "Alice",
  age: 25,
  greet: function() {
    console.log("Hi, I'm " + this.name);
  }
};

person.name;   // Access property

**Control Flow:**
- if/else statements
- for loops: for (let i = 0; i < 10; i++)
- while loops
- switch statements

**Operators:**
- Arithmetic: +, -, *, /, %
- Comparison: ==, ===, !=, !==, <, >, <=, >=
- Logical: &&, ||, !

Practice these fundamentals - they're the foundation of all JavaScript programming!`,
        quiz: [
          {
            question: 'Which keyword declares a block-scoped variable?',
            options: ['var', 'let', 'const', 'static'],
            correctIndex: 1
          },
          {
            question: 'What is the result of typeof []?',
            options: ['array', 'object', 'list', 'undefined'],
            correctIndex: 1
          },
          {
            question: 'Which method adds an item to the end of an array?',
            options: ['push()', 'pop()', 'shift()', 'slice()'],
            correctIndex: 0
          }
        ],
        order: 3
      },
      {
        title: 'DOM Manipulation',
        description: 'Interact with web pages using JavaScript',
        duration: '4 hours',
        content: `DOM Manipulation - Making Pages Interactive!

The DOM (Document Object Model) represents your HTML as a tree of objects that JavaScript can manipulate.

**Selecting Elements:**

1. By ID:
   const header = document.getElementById('header');

2. By Class:
   const cards = document.getElementsByClassName('card');

3. Query Selector (modern & flexible):
   const button = document.querySelector('.btn-primary');
   const allButtons = document.querySelectorAll('button');

**Modifying Content:**

- Change text:
  element.innerText = "New text";
  element.innerHTML = "<strong>Bold text</strong>";

- Change styles:
  element.style.color = "red";
  element.style.backgroundColor = "blue";

- Modify classes:
  element.classList.add('active');
  element.classList.remove('hidden');
  element.classList.toggle('highlight');

- Change attributes:
  element.setAttribute('src', 'image.jpg');
  element.getAttribute('href');

**Event Handling:**

Events let you respond to user interactions:

button.addEventListener('click', function() {
  console.log('Button clicked!');
});

**Common Events:**
- click - element is clicked
- submit - form is submitted
- change - input value changes
- mouseover/mouseout - hover effects
- keydown/keyup - keyboard input
- load - page/image finishes loading

**Creating Elements:**

const newDiv = document.createElement('div');
newDiv.innerText = 'Hello!';
newDiv.classList.add('card');
document.body.appendChild(newDiv);

**Removing Elements:**

element.remove();
// or
parent.removeChild(child);

**Practical Example - Todo List:**

const addButton = document.querySelector('#add-btn');
const todoInput = document.querySelector('#todo-input');
const todoList = document.querySelector('#todo-list');

addButton.addEventListener('click', () => {
  const li = document.createElement('li');
  li.innerText = todoInput.value;
  todoList.appendChild(li);
  todoInput.value = '';  // Clear input
});

**Best Practices:**
- Cache DOM queries in variables
- Use event delegation for dynamic elements
- Minimize direct DOM manipulation
- Use data attributes for storing data

Master these concepts and you can create any interactive web feature!`,
        quiz: [
          {
            question: 'Which method selects an element by id?',
            options: ['querySelectorAll', 'getElementById', 'getElementsByClassName', 'selectById'],
            correctIndex: 1
          },
          {
            question: 'Which event fires on a button click?',
            options: ['hover', 'submit', 'click', 'change'],
            correctIndex: 2
          },
          {
            question: 'Which property sets text inside an element?',
            options: ['innerText', 'outerText', 'textValue', 'nodeText'],
            correctIndex: 0
          }
        ],
        order: 4
      }
    ]
  },
  {
    title: 'Python for Data Science',
    description: 'Master Python programming for data analysis and visualization',
    category: 'Data Science',
    difficulty: 'Intermediate',
    duration: '35 hours',
    instructor: 'Dr. Sarah Williams',
    modules: [
      {
        title: 'Python Basics',
        description: 'Introduction to Python programming',
        duration: '4 hours',
        content: `Python Programming Fundamentals!

Python is a versatile, readable programming language widely used in data science, web development, automation, and more.

**Why Python?**
- Easy to read and write
- Powerful standard library
- Excellent for data analysis
- Active community

**Variables and Data Types:**

# Numbers
age = 25
price = 19.99

# Strings
name = "Alice"
message = 'Hello World'

# Booleans
is_active = True
has_license = False

# Lists (mutable)
fruits = ['apple', 'banana', 'cherry']
numbers = [1, 2, 3, 4, 5]

# Tuples (immutable)
coordinates = (10, 20)

# Dictionaries (key-value pairs)
person = {
    'name': 'John',
    'age': 30,
    'city': 'New York'
}

**Control Structures:**

# If statements
if age >= 18:
    print("Adult")
elif age >= 13:
    print("Teen")
else:
    print("Child")

# For loops
for fruit in fruits:
    print(fruit)

for i in range(5):  # 0 to 4
    print(i)

# While loops
count = 0
while count < 5:
    print(count)
    count += 1

**Functions:**

def greet(name):
    return f"Hello, {name}!"

def add(a, b=0):  # Default parameter
    return a + b

result = add(5, 3)  # 8

**List Operations:**

fruits = ['apple', 'banana']
fruits.append('cherry')     # Add to end
fruits.insert(0, 'mango')   # Add at position
fruits.remove('banana')     # Remove by value
last = fruits.pop()         # Remove and return last
length = len(fruits)        # Get length

**String Operations:**

text = "Hello World"
upper = text.upper()                # "HELLO WORLD"
lower = text.lower()                # "hello world"
words = text.split()                # ['Hello', 'World']
combined = ", ".join(['a', 'b'])    # "a, b"

**Important Built-in Functions:**
- print() - output to console
- len() - get length
- type() - get data type
- input() - get user input
- range() - generate number sequence

**Practice Tip:**
Write code daily, even if just for 15 minutes!`,
        quiz: [
          {
            question: 'Which keyword defines a function in Python?',
            options: ['func', 'define', 'def', 'function'],
            correctIndex: 2
          },
          {
            question: 'What is the output of len([1,2,3])?',
            options: ['2', '3', '4', 'Error'],
            correctIndex: 1
          },
          {
            question: 'Which type is immutable?',
            options: ['list', 'dict', 'set', 'tuple'],
            correctIndex: 3
          }
        ],
        order: 1
      },
      {
        title: 'NumPy and Pandas',
        description: 'Data manipulation with NumPy and Pandas',
        duration: '6 hours',
        content: `NumPy and Pandas - The Power Tools of Data Science!

These libraries are essential for data manipulation and analysis in Python.

**NumPy - Numerical Python:**

NumPy provides support for large multi-dimensional arrays and mathematical functions.

import numpy as np

# Creating arrays
arr = np.array([1, 2, 3, 4, 5])
matrix = np.array([[1, 2], [3, 4]])

# Array operations (vectorized - very fast!)
arr * 2           # [2, 4, 6, 8, 10]
arr + 10          # [11, 12, 13, 14, 15]
arr.mean()        # Average
arr.sum()         # Sum
arr.max()         # Maximum value

# Creating special arrays
zeros = np.zeros((3, 3))      # 3x3 array of zeros
ones = np.ones((2, 4))        # 2x4 array of ones
arange = np.arange(0, 10, 2)  # [0, 2, 4, 6, 8]

**Pandas - Data Analysis:**

Pandas provides DataFrame (like Excel tables) for working with structured data.

import pandas as pd

# Creating a DataFrame
data = {
    'Name': ['Alice', 'Bob', 'Charlie'],
    'Age': [25, 30, 35],
    'City': ['NYC', 'LA', 'Chicago']
}
df = pd.DataFrame(data)

# Viewing data
df.head()          # First 5 rows
df.tail()          # Last 5 rows
df.info()          # Data types and info
df.describe()      # Statistical summary

# Selecting data
df['Name']         # Select column
df[['Name', 'Age']] # Select multiple columns
df[df['Age'] > 25] # Filter rows

# Adding/modifying columns
df['Country'] = 'USA'
df['Age_Group'] = df['Age'].apply(lambda x: 'Young' if x < 30 else 'Adult')

# Handling missing data
df.dropna()               # Remove rows with any NaN
df.fillna(0)              # Replace NaN with 0
df['Age'].fillna(df['Age'].mean())  # Fill with mean

# Grouping and aggregation
df.groupby('City')['Age'].mean()
df.groupby('City').agg({'Age': ['mean', 'max']})

# Reading/writing files
df = pd.read_csv('data.csv')
df.to_csv('output.csv', index=False)

**Common Operations:**

# Sorting
df.sort_values('Age', ascending=False)

# Merging DataFrames
pd.merge(df1, df2, on='ID')
pd.concat([df1, df2])

# String operations
df['Name'].str.upper()
df['Name'].str.contains('Alice')

**Best Practices:**
- Always check data with head() and info() first
- Handle missing values appropriately
- Use vectorized operations instead of loops
- Keep transformations documented

These libraries make Python incredibly powerful for data analysis!`,
        quiz: [
          {
            question: 'Pandas main table-like structure is called?',
            options: ['Series', 'DataFrame', 'Matrix', 'Table'],
            correctIndex: 1
          },
          {
            question: 'NumPy is mainly used for?',
            options: ['Web scraping', 'Numerical arrays', 'GUI apps', 'Email'],
            correctIndex: 1
          },
          {
            question: 'Which method shows first 5 rows in Pandas?',
            options: ['top()', 'head()', 'first()', 'peek()'],
            correctIndex: 1
          }
        ],
        order: 2
      },
      {
        title: 'Data Visualization',
        description: 'Create charts and graphs',
        duration: '5 hours',
        content: `Data Visualization - Bringing Data to Life!

Visualizing data helps uncover patterns, trends, and insights that numbers alone can't reveal.

**Matplotlib - The Foundation:**

Matplotlib is the most widely used Python plotting library.

import matplotlib.pyplot as plt

# Line plot
x = [1, 2, 3, 4, 5]
y = [2, 4, 6, 8, 10]
plt.plot(x, y)
plt.xlabel('X Axis')
plt.ylabel('Y Axis')
plt.title('My Line Plot')
plt.show()

# Bar chart
categories = ['A', 'B', 'C', 'D']
values = [25, 40, 30, 55]
plt.bar(categories, values, color='steelblue')
plt.show()

# Histogram (distribution)
data = [1, 2, 2, 3, 3, 3, 4, 4, 5]
plt.hist(data, bins=5, edgecolor='black')
plt.show()

# Scatter plot
x = [1, 2, 3, 4, 5]
y = [2, 3, 5, 7, 11]
plt.scatter(x, y, color='red', marker='o')
plt.show()

# Multiple subplots
fig, axes = plt.subplots(2, 2, figsize=(10, 8))
axes[0, 0].plot([1, 2, 3], [1, 4, 9])
axes[0, 1].bar(['A', 'B'], [10, 20])
plt.tight_layout()
plt.show()

**Seaborn - Beautiful Statistical Plots:**

Seaborn builds on Matplotlib with attractive defaults and statistical functions.

import seaborn as sns

# Set style
sns.set_style('whitegrid')

# Box plot (show distribution)
tips = sns.load_dataset('tips')
sns.boxplot(x='day', y='total_bill', data=tips)

# Violin plot (distribution with density)
sns.violinplot(x='day', y='total_bill', data=tips)

# Heatmap (correlation matrix)
corr = df.corr()
sns.heatmap(corr, annot=True, cmap='coolwarm')

# Pair plot (relationships between variables)
sns.pairplot(iris_data, hue='species')

# Count plot (bar chart for categories)
sns.countplot(x='day', data=tips)

**Choosing the Right Chart:**

- Line Chart: Trends over time
- Bar Chart: Compare categories
- Histogram: Distribution of values
- Scatter Plot: Relationship between two variables
- Box Plot: Show spread and outliers
- Heatmap: Show matrix of values (correlations)
- Pie Chart: Parts of a whole (use sparingly)

**Best Practices:**

1. Choose appropriate chart types
2. Label axes clearly
3. Add informative titles
4. Use color purposefully
5. Avoid clutter (less is more)
6. Consider your audience
7. Make it accessible (color-blind friendly)

**Customization Tips:**

# Figure size
plt.figure(figsize=(10, 6))

# Colors
plt.plot(x, y, color='#FF5733', linewidth=2)

# Legend
plt.legend(['Series 1', 'Series 2'])

# Grid
plt.grid(True, alpha=0.3)

# Save figure
plt.savefig('my_plot.png', dpi=300, bbox_inches='tight')

Visualization is both art and science - practice makes perfect!`,
        quiz: [
          {
            question: 'Which library is commonly used for plotting in Python?',
            options: ['Matplotlib', 'TensorFlow', 'Flask', 'Django'],
            correctIndex: 0
          },
          {
            question: 'Seaborn is built on top of?',
            options: ['NumPy', 'Matplotlib', 'Pandas', 'SciPy'],
            correctIndex: 1
          },
          {
            question: 'A bar chart is best for?',
            options: ['Time series', 'Category comparison', '3D modeling', 'Networking'],
            correctIndex: 1
          }
        ],
        order: 3
      }
    ]
  },
  {
    title: 'React JS Masterclass',
    description: 'Build modern web applications with React',
    category: 'Web Development',
    difficulty: 'Intermediate',
    duration: '30 hours',
    instructor: 'Prof. David Lee',
    modules: [
      {
        title: 'React Fundamentals',
        description: 'Learn React basics',
        duration: '5 hours',
        content: `React Fundamentals - Building Modern User Interfaces!

React is a JavaScript library for building user interfaces, maintained by Facebook and a community of developers.

**What is React?**
- Component-based architecture
- Declarative (describe what you want, React handles how)
- Virtual DOM for efficient updates
- Unidirectional data flow

**Components:**

Components are the building blocks of React apps.

// Function Component (modern way)
function Welcome(props) {
  return <h1>Hello, {props.name}!</h1>;
}

// Arrow function component
const Greeting = (props) => {
  return <div>Welcome, {props.user}!</div>;
};

// Using components
<Welcome name="Alice" />

**JSX - JavaScript XML:**

JSX lets you write HTML-like code in JavaScript.

const element = <h1>Hello World</h1>;

// With JavaScript expressions
const name = "John";
const greeting = <h1>Hello, {name}!</h1>;

// Attributes
const img = <img src={imageUrl} alt="Description" />;

// Multiple elements need a parent
return (
  <div>
    <h1>Title</h1>
    <p>Content</p>
  </div>
);

// Or use Fragment
return (
  <>
    <h1>Title</h1>
    <p>Content</p>
  </>
);

**Props - Passing Data:**

Props let you pass data from parent to child components.

function UserCard(props) {
  return (
    <div className="card">
      <h2>{props.name}</h2>
      <p>Age: {props.age}</p>
      <p>{props.email}</p>
    </div>
  );
}

// Using the component
<UserCard 
  name="Alice" 
  age={25} 
  email="alice@example.com" 
/>

// Destructuring props
function UserCard({ name, age, email }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>Age: {age}</p>
    </div>
  );
}

**Conditional Rendering:**

// Using if
function Greeting({ isLoggedIn }) {
  if (isLoggedIn) {
    return <h1>Welcome back!</h1>;
  }
  return <h1>Please sign in</h1>;
}

// Using ternary
{isLoggedIn ? <Dashboard /> : <Login />}

// Using &&
{hasMessages && <MessageList />}

**Lists and Keys:**

const fruits = ['apple', 'banana', 'cherry'];

return (
  <ul>
    {fruits.map((fruit, index) => (
      <li key={index}>{fruit}</li>
    ))}
  </ul>
);

**Events:**

function Button() {
  const handleClick = () => {
    alert('Button clicked!');
  };

  return (
    <button onClick={handleClick}>
      Click Me
    </button>
  );
}

// With parameters
<button onClick={() => handleClick(id)}>Delete</button>

**CSS in React:**

// Inline styles
const style = {
  color: 'blue',
  fontSize: '20px'
};
<div style={style}>Styled text</div>

// CSS classes
<div className="card primary">Content</div>

// CSS Modules
import styles from './Button.module.css';
<button className={styles.primary}>Click</button>

**Best Practices:**
- Keep components small and focused
- Use meaningful names
- Extract reusable components
- Props should be read-only
- Always provide keys for lists

React makes building interactive UIs intuitive and efficient!`,
        quiz: [
          {
            question: 'React is mainly used for building?',
            options: ['Databases', 'User interfaces', 'Operating systems', 'Compilers'],
            correctIndex: 1
          },
          {
            question: 'JSX is a syntax extension for?',
            options: ['Python', 'Java', 'JavaScript', 'C++'],
            correctIndex: 2
          },
          {
            question: 'Props are used to?',
            options: ['Store state', 'Pass data to components', 'Create routes', 'Handle DB queries'],
            correctIndex: 1
          }
        ],
        order: 1
      },
      {
        title: 'State Management',
        description: 'Managing state in React',
        duration: '4 hours',
        content: `State Management in React - Making Apps Interactive!

State is data that changes over time. Managing state effectively is key to building dynamic React applications.

**useState Hook:**

The useState hook lets you add state to function components.

import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);  // Initial value: 0

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <button onClick={() => setCount(count - 1)}>
        Decrement
      </button>
      <button onClick={() => setCount(0)}>
        Reset
      </button>
    </div>
  );
}

// Multiple state variables
function Form() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState(0);

  return (
    <form>
      <input 
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
    </form>
  );
}

// State with objects
const [user, setUser] = useState({
  name: '',
  email: '',
  age: 0
});

// Update object state (spread operator to keep other properties)
setUser({ ...user, name: 'Alice' });

**useEffect Hook:**

useEffect lets you perform side effects (data fetching, subscriptions, timers).

import { useEffect } from 'react';

// Run on every render
useEffect(() => {
  console.log('Component rendered');
});

// Run only once (on mount)
useEffect(() => {
  console.log('Component mounted');
}, []);  // Empty dependency array

// Run when specific values change
useEffect(() => {
  console.log('Count changed:', count);
}, [count]);  // Runs when count changes

// Cleanup function
useEffect(() => {
  const timer = setInterval(() => {
    console.log('Tick');
  }, 1000);

  // Cleanup
  return () => clearInterval(timer);
}, []);

// Fetching data example
useEffect(() => {
  fetch('https://api.example.com/data')
    .then(res => res.json())
    .then(data => setData(data))
    .catch(err => setError(err));
}, []);

**Context API - Avoid Prop Drilling:**

Context lets you share data without passing props through every level.

// Create context
import { createContext, useContext } from 'react';

const ThemeContext = createContext();

// Provider component
function App() {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Header />
      <Main />
    </ThemeContext.Provider>
  );
}

// Consume context
function Header() {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <header className={theme}>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle Theme
      </button>
    </header>
  );
}

**Common Patterns:**

// Loading state
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  setLoading(true);
  fetch('/api/data')
    .then(res => res.json())
    .then(data => {
      setData(data);
      setLoading(false);
    })
    .catch(err => {
      setError(err);
      setLoading(false);
    });
}, []);

if (loading) return <div>Loading...</div>;
if (error) return <div>Error: {error.message}</div>;
return <div>{data}</div>;

// Form handling
function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit form data
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="email"
        value={formData.email}
        onChange={handleChange}
      />
      <input
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
      />
      <button type="submit">Login</button>
    </form>
  );
}

**Best Practices:**
- Don't call hooks inside loops, conditions, or nested functions
- State updates may be asynchronous
- Use functional updates when new state depends on previous state
- Keep state as local as possible
- Use Context for truly global state only
- Consider useReducer for complex state logic

Master these concepts to build powerful, interactive React applications!`,
        quiz: [
          {
            question: 'Which hook is used for side effects?',
            options: ['useMemo', 'useEffect', 'useRef', 'useId'],
            correctIndex: 1
          },
          {
            question: 'State updates are?',
            options: ['Always synchronous', 'Asynchronous/batched', 'Not allowed', 'Only in classes'],
            correctIndex: 1
          },
          {
            question: 'Context is useful for?',
            options: ['Avoiding prop drilling', 'SQL queries', 'Building CSS', 'Testing only'],
            correctIndex: 0
          }
        ],
        order: 2
      },
      {
        title: 'Building Real Projects',
        description: 'Create actual React applications',
        duration: '6 hours',
        content: `Building Real React Projects - Putting It All Together!

The best way to learn React is by building actual projects. Let's explore practical applications you can build!

**Project 1: Todo List App**

A classic beginner project that covers CRUD operations.

Key features to implement:
- Add new todos
- Mark todos as complete
- Delete todos
- Filter todos (all, active, completed)
- Persist data in localStorage

Code structure:
function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all');

  const addTodo = () => {
    setTodos([...todos, {
      id: Date.now(),
      text: input,
      completed: false
    }]);
    setInput('');
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return (/* JSX here */);
}

**Project 2: Weather App**

Fetches data from an external API and displays it beautifully.

Key features:
- Search for city weather
- Display current weather
- Show 5-day forecast
- Handle loading and error states
- Display weather icons

Key concepts:
- API integration with fetch/axios
- Async operations with useEffect
- Error handling
- Conditional rendering
- Component composition

**Project 3: E-commerce Product Catalog**

A more complex app with multiple features.

Key features:
- Display product grid
- Search and filter products
- Add to cart functionality
- Shopping cart with quantity management
- Calculate total price
- Responsive design

Component structure:
- App (main)
  - Header (search, cart icon)
  - ProductList
    - ProductCard
  - Cart
    - CartItem
  - Footer

State management:
- Products list
- Search query
- Category filter
- Cart items
- Cart total

**React Router - Navigation:**

For multi-page apps:

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/products">Products</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

**API Integration with Axios:**

import axios from 'axios';

// GET request
const fetchData = async () => {
  try {
    const response = await axios.get('/api/products');
    setProducts(response.data);
  } catch (error) {
    setError(error.message);
  }
};

// POST request
const createProduct = async (productData) => {
  try {
    const response = await axios.post('/api/products', productData);
    setProducts([...products, response.data]);
  } catch (error) {
    console.error(error);
  }
};

**Best Practices for Real Projects:**

1. Component Organization:
   - Create a components/ folder
   - One component per file
   - Group related components

2. State Management:
   - Lift state up when needed
   - Consider Context for app-wide state
   - Use custom hooks for reusable logic

3. Styling:
   - Use CSS Modules or styled-components
   - Keep styles close to components
   - Create a theme/design system

4. Performance:
   - Use React.memo for expensive components
   - Implement lazy loading with React.lazy()
   - Optimize re-renders

5. Code Quality:
   - Use meaningful variable names
   - Add PropTypes or TypeScript
   - Write comments for complex logic
   - Break down large components

**Project Ideas to Practice:**

Beginner:
- Calculator
- Quiz app
- Note-taking app

Intermediate:
- Movie search (TMDB API)
- Recipe finder
- Chat application
- Music player

Advanced:
- Social media dashboard
- Project management tool
- Real-time collaboration app

**Deployment:**

Deploy your projects to:
- Vercel (easiest for React)
- Netlify
- GitHub Pages
- Heroku

Remember: Every expert was once a beginner. Keep building, keep learning!`,
        quiz: [
          {
            question: 'Which library helps with routing in React apps?',
            options: ['React Router', 'Axios', 'Mongoose', 'Express'],
            correctIndex: 0
          },
          {
            question: 'Axios is typically used for?',
            options: ['HTTP requests', 'Animations', 'Database migrations', 'CSS grids'],
            correctIndex: 0
          },
          {
            question: 'A component should ideally be?',
            options: ['Huge', 'Reusable', 'Hard-coded', 'Global'],
            correctIndex: 1
          }
        ],
        order: 3
      }
    ]
  },
  {
    title: 'Machine Learning Basics',
    description: 'Introduction to Machine Learning concepts and algorithms',
    category: 'Machine Learning',
    difficulty: 'Advanced',
    duration: '45 hours',
    instructor: 'Dr. Emily Chen',
    modules: [
      {
        title: 'ML Introduction',
        description: 'What is Machine Learning?',
        duration: '3 hours',
        content: `Introduction to Machine Learning - The Future is Here!

Machine Learning (ML) is a branch of Artificial Intelligence that enables computers to learn from data without being explicitly programmed.

**What is Machine Learning?**

Instead of writing rules, we feed data to algorithms that learn patterns and make predictions.

Traditional Programming:
  Input + Rules → Output

Machine Learning:
  Input + Output → Rules (Model)

**Types of Machine Learning:**

1. **Supervised Learning:**
   - Learning from labeled data
   - Examples: Classification, Regression
   - Use case: Predicting house prices, spam detection

2. **Unsupervised Learning:**
   - Learning from unlabeled data
   - Examples: Clustering, Dimensionality reduction
   - Use case: Customer segmentation, anomaly detection

3. **Reinforcement Learning:**
   - Learning through trial and error
   - Agent learns by receiving rewards/penalties
   - Use case: Game AI, robotics, self-driving cars

**ML Workflow:**

1. **Problem Definition**
   - What are you trying to predict?
   - What data do you need?

2. **Data Collection**
   - Gather relevant data
   - More data usually means better models

3. **Data Preprocessing**
   - Clean the data (handle missing values)
   - Transform features (normalization, encoding)
   - Split data: Training (70-80%), Testing (20-30%)

4. **Model Selection**
   - Choose appropriate algorithm
   - Consider problem type and data size

5. **Training**
   - Feed training data to the model
   - Model learns patterns

6. **Evaluation**
   - Test on unseen data
   - Measure accuracy, precision, recall

7. **Deployment**
   - Deploy model to production
   - Monitor performance

**Common ML Applications:**

- **Healthcare:** Disease diagnosis, drug discovery
- **Finance:** Fraud detection, stock prediction
- **Retail:** Recommendation systems, demand forecasting
- **Transportation:** Self-driving cars, route optimization
- **Entertainment:** Content recommendation (Netflix, Spotify)
- **Marketing:** Customer segmentation, ad targeting

**Key Terminology:**

- **Features:** Input variables (e.g., house size, location)
- **Labels:** Output/target variable (e.g., house price)
- **Training:** Process of learning from data
- **Model:** The learned patterns/rules
- **Prediction:** Using model on new data
- **Overfitting:** Model memorizes training data
- **Underfitting:** Model is too simple

**Popular ML Libraries:**

- **Scikit-learn:** Traditional ML algorithms
- **TensorFlow:** Deep learning
- **PyTorch:** Deep learning (research-friendly)
- **Keras:** High-level neural network API
- **XGBoost:** Gradient boosting

**Getting Started:**

Start with simple problems:
1. Iris flower classification (beginner classic)
2. House price prediction
3. Handwritten digit recognition (MNIST)

**Skills Needed:**

- Python programming
- Statistics and probability
- Linear algebra basics
- Data analysis (Pandas, NumPy)
- Critical thinking

**Remember:**
"Machine Learning is like learning to ride a bike. You'll fall a few times, but once you get it, it's incredible!"

The field is constantly evolving - stay curious and keep learning!`,
        quiz: [
          {
            question: 'Machine Learning is a part of?',
            options: ['Artificial Intelligence', 'Web design', 'Networking', 'Databases only'],
            correctIndex: 0
          },
          {
            question: 'Supervised learning uses?',
            options: ['No labels', 'Labeled data', 'Only images', 'Only text'],
            correctIndex: 1
          },
          {
            question: 'A model is trained to?',
            options: ['Guess randomly', 'Learn patterns from data', 'Delete data', 'Format drives'],
            correctIndex: 1
          }
        ],
        order: 1
      },
      {
        title: 'Supervised Learning',
        description: 'Linear regression and classification',
        duration: '8 hours',
        content: `Supervised Learning - Learning from Examples!

Supervised learning uses labeled data where we know the correct output. The model learns to map inputs to outputs.

**Two Main Types:**

1. **Regression:** Predict continuous values (numbers)
2. **Classification:** Predict categories/classes

**Linear Regression:**

Predicts a continuous output based on input features.

Example: Predicting house prices based on size

y = mx + b  (simple linear)
Price = (slope × size) + intercept

from sklearn.linear_model import LinearRegression

# Training
model = LinearRegression()
model.fit(X_train, y_train)  # Learn from data

# Prediction
predictions = model.predict(X_test)

# Evaluation
from sklearn.metrics import mean_squared_error, r2_score
mse = mean_squared_error(y_test, predictions)
r2 = r2_score(y_test, predictions)

**Multiple Linear Regression:**

Multiple features → One output
Price = (w1 × size) + (w2 × bedrooms) + (w3 × location) + b

**Classification Algorithms:**

**1. Logistic Regression:**
   Despite the name, it's for classification!
   Outputs probability (0 to 1)

from sklearn.linear_model import LogisticRegression

model = LogisticRegression()
model.fit(X_train, y_train)
predictions = model.predict(X_test)

# Probability predictions
probabilities = model.predict_proba(X_test)

**2. Decision Trees:**
   Makes decisions using if-then-else rules

from sklearn.tree import DecisionTreeClassifier

model = DecisionTreeClassifier(max_depth=5)
model.fit(X_train, y_train)

Advantages:
- Easy to understand and visualize
- Handles non-linear relationships
- No need to normalize data

Disadvantages:
- Can overfit easily
- Unstable (small data changes affect tree)

**3. Random Forest:**
   Ensemble of decision trees (wisdom of crowds)

from sklearn.ensemble import RandomForestClassifier

model = RandomForestClassifier(n_estimators=100)
model.fit(X_train, y_train)

Benefits:
- More accurate than single tree
- Reduces overfitting
- Handles large datasets well

**4. Support Vector Machines (SVM):**
   Finds optimal boundary between classes

from sklearn.svm import SVC

model = SVC(kernel='rbf')  # 'linear', 'poly', 'rbf'
model.fit(X_train, y_train)

**5. K-Nearest Neighbors (KNN):**
   Classifies based on closest training examples

from sklearn.neighbors import KNeighborsClassifier

model = KNeighborsClassifier(n_neighbors=5)
model.fit(X_train, y_train)

**Model Evaluation Metrics:**

**For Regression:**
- **MSE:** Mean Squared Error (lower is better)
- **RMSE:** Root Mean Squared Error
- **R² Score:** How well model fits data (1 is perfect)
- **MAE:** Mean Absolute Error

**For Classification:**
- **Accuracy:** Correct predictions / Total predictions
- **Precision:** True Positives / (True Positives + False Positives)
- **Recall:** True Positives / (True Positives + False Negatives)
- **F1-Score:** Harmonic mean of Precision and Recall
- **Confusion Matrix:** Visual breakdown of predictions

from sklearn.metrics import classification_report, confusion_matrix

print(classification_report(y_test, predictions))
print(confusion_matrix(y_test, predictions))

**Overfitting vs Underfitting:**

**Overfitting:**
- Model too complex
- Memorizes training data
- Poor performance on new data
- Solution: More data, regularization, simpler model

**Underfitting:**
- Model too simple
- Doesn't capture patterns
- Poor performance everywhere
- Solution: More features, more complex model

**Train-Test Split:**

from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

**Cross-Validation:**

More robust evaluation:

from sklearn.model_selection import cross_val_score

scores = cross_val_score(model, X, y, cv=5)  # 5-fold CV
print(f"Average: {scores.mean()}, Std: {scores.std()}")

**Feature Engineering:**

Creating better features often beats fancy algorithms:

- **Scaling:** Normalize/Standardize features
- **Encoding:** Convert categories to numbers
- **Creating New Features:** Combine existing ones
- **Selecting Important Features:** Remove noise

from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_train)

**Practical Tips:**

1. Start simple (Logistic Regression or Decision Tree)
2. Always establish a baseline
3. Visualize your data first
4. Handle missing values appropriately
5. Try multiple algorithms
6. Tune hyperparameters
7. Use cross-validation
8. Monitor for overfitting

**Real-World Example - Email Spam Detection:**

Features: Word frequencies, sender, links
Label: Spam (1) or Not Spam (0)

from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB

# Convert text to numbers
vectorizer = CountVectorizer()
X = vectorizer.fit_transform(emails)

# Train classifier
model = MultinomialNB()
model.fit(X_train, y_train)

# Predict
new_email = ["Win FREE money now!!!"]
X_new = vectorizer.transform(new_email)
prediction = model.predict(X_new)  # [1] = spam

Master these fundamentals and you'll be able to solve countless real-world problems!`,
        quiz: [
          {
            question: 'Linear regression predicts?',
            options: ['A category', 'A number', 'A database', 'A network'],
            correctIndex: 1
          },
          {
            question: 'Classification predicts?',
            options: ['Continuous value', 'A class/label', 'A color only', 'A sound'],
            correctIndex: 1
          },
          {
            question: 'Overfitting means?',
            options: ['Model too simple', 'Model memorizes training data', 'No training', 'No features'],
            correctIndex: 1
          }
        ],
        order: 2
      }
    ]
  },
  {
    title: 'Mobile App Development with Flutter',
    description: 'Create cross-platform mobile apps',
    category: 'Mobile Development',
    difficulty: 'Beginner',
    duration: '38 hours',
    instructor: 'Prof. Robert Taylor',
    modules: [
      {
        title: 'Flutter Setup',
        description: 'Install and configure Flutter',
        duration: '2 hours',
        content: `Getting Started with Flutter - Cross-Platform Magic!

Flutter is Google's UI toolkit for building beautiful, natively compiled applications for mobile, web, and desktop from a single codebase.

**Why Flutter?**

✅ **One Codebase:** Write once, run on iOS, Android, Web, Desktop
✅ **Fast Development:** Hot reload sees changes instantly
✅ **Beautiful UI:**Pre-built widgets for Material and Cupertino design
✅ **High Performance:** Compiled to native code
✅ **Strong Community:** Growing rapidly with great packages

**Installation Steps:**

**1. System Requirements:**
- Operating System: Windows 10+, macOS, or Linux
- Disk Space: 2.8 GB (not including IDE)
- Tools: Git for Windows

**2. Download Flutter SDK:**
- Visit: flutter.dev
- Download Flutter SDK for your OS
- Extract to desired location (e.g., C:\\flutter)

**3. Update PATH:**
Add Flutter to your system PATH:
- Windows: Add C:\\flutter\\bin to PATH
- Mac/Linux: Add to ~/.bashrc or ~/.zshrc

**4. Run Flutter Doctor:**
flutter doctor

This checks your environment and lists what you need to install.

**5. Install IDE:**

**Option A: VS Code (Lightweight)**
1. Install VS Code
2. Install Flutter extension
3. Install Dart extension

**Option B: Android Studio (Full-featured)**
1. Download Android Studio
2. Install Flutter and Dart plugins
3. Configure Android SDK

**6. Set up Android Emulator:**
- Open Android Studio
- Tools → AVD Manager
- Create Virtual Device
- Select device and system image
- Finish setup

**7. Set up iOS Simulator (Mac only):**
- Install Xcode from App Store
- Run: sudo xcode-select --switch /Applications/Xcode.app
- Run: sudo xcodebuild -runFirstLaunch

**Creating Your First Flutter App:**

# Create new project
flutter create my_first_app

# Navigate to project
cd my_first_app

# Run app
flutter run

**Project Structure:**

my_first_app/
├── android/          # Android-specific files
├── ios/              # iOS-specific files
├── lib/              # Your Dart code goes here!
│   └── main.dart     # Entry point
├── test/             # Unit tests
├── pubspec.yaml      # Dependencies & assets
└── README.md

**Understanding main.dart:**

import 'package:flutter/material.dart';

// Entry point of app
void main() {
  runApp(MyApp());
}

// Root widget
class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'My First App',
      home: HomePage(),
    );
  }
}

**Hot Reload - The Game Changer:**

While app is running:
- Press 'r' for hot reload (updates UI instantly)
- Press 'R' for hot restart (full restart)
- Press 'q' to quit

Make a change in your code, save, press 'r' - see it instantly!

**Flutter Widget Inspector:**

Debug UI issues easily:
- Shows widget tree
- Displays widget properties
- Helps understand layout

**Common Flutter Commands:**

# Create new project
flutter create project_name

# Run on device/emulator
flutter run

# Get app installed on device/simulator
flutter devices

# Install dependencies
flutter pub get

# Update dependencies
flutter pub upgrade

# Build APK
flutter build apk

# Build iOS
flutter build ios

# Clean build files
flutter clean

**pubspec.yaml - The Configuration File:**

name: my_first_app
description: A new Flutter project
version: 1.0.0+1

environment:
  sdk: ">=2.1.0 <3.0.0"

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.0

dev_dependencies:
  flutter_test:
    sdk: flutter

flutter:
  uses-material-design: true
  assets:
    - images/
  fonts:
    - family: Roboto
      fonts:
        - asset: fonts/Roboto-Regular.ttf

**Troubleshooting:**

**Issue:** Flutter doctor shows Android licenses not accepted
**Solution:** flutter doctor --android-licenses

**Issue:** App not installing on device
**Solution:** 
- Enable USB debugging on device
- Check device is listed: flutter devices
- Try: flutter clean && flutter run

**Issue:** Hot reload not working
**Solution:** 
- Try hot restart (R)
- Save file before pressing 'r'

**Best Practices:**

1. Run flutter doctor regularly
2. Keep Flutter SDK updated: flutter upgrade
3. Use version control (Git)
4. Follow Flutter style guide
5. Use meaningful widget names

**Next Steps:**

1. Explore the sample app
2. Modify text and colors
3. Add new widgets
4. Learn Dart basics
5. Build simple UI

**Resources:**

- Official Docs: flutter.dev/docs
- Widget Catalog: flutter.dev/widgets
- Pub.dev: Package repository
- Flutter YouTube Channel
- Stack Overflow

You're now ready to start building amazing Flutter apps! 🚀`,
        quiz: [
          {
            question: 'Flutter apps are written in?',
            options: ['Java', 'Dart', 'Python', 'C#'],
            correctIndex: 1
          },
          {
            question: 'Flutter is mainly for?',
            options: ['Mobile/web UI', 'Database admin', 'Operating systems', 'DevOps only'],
            correctIndex: 0
          },
          {
            question: 'Hot reload helps by?',
            options: ['Restarting PC', 'Updating UI quickly', 'Deleting cache', 'Upgrading DB'],
            correctIndex: 1
          }
        ],
        order: 1
      },
      {
        title: 'Dart Programming',
        description: 'Learn Dart language',
        duration: '6 hours',
        content: `Dart Programming - The Language of Flutter!

Dart is a client-optimized language for fast apps on any platform. It's the language Flutter uses!

**Why Dart?**
- Easy to learn (similar to JavaScript, Java, C#)
- Strong typing with type inference
- Supports both JIT and AOT compilation
- Great for UI development

**Variables and Data Types:**

// Type inference
var name = 'Alice';  // Dart knows it's a String
var age = 25;        // Dart knows it's an int

// Explicit types
String city = 'New York';
int score = 100;
double price = 19.99;
bool isActive = true;

// Constants
const PI = 3.14159;      // Compile-time constant
final timestamp = DateTime.now();  // Runtime constant

// Null safety (Dart 2.12+)
String? nullable = null;  // Can be null
String nonNullable = 'Hello';  // Cannot be null

**String Operations:**

String name = 'Flutter';
String greeting = 'Hello, $name!';  // String interpolation
String message = 'Result: ${2 + 2}';  // Expression

String multiLine = '''
  This is a
  multi-line
  string
''';

// Methods
name.toUpperCase();      // 'FLUTTER'
name.toLowerCase();      // 'flutter'
name.length;             // 7
name.contains('lut');    // true

**Numbers:**

int count = 42;
double temperature = 98.6;

// Operations
int sum = 10 + 5;
int difference = 10 - 5;
int product = 10 * 5;
double quotient = 10 / 5;
int remainder = 10 % 3;

// Conversion
int.parse('42');         // String to int
double.parse('3.14');    // String to double
42.toString();           // int to String

**Collections:**

// Lists (arrays)
List<String> fruits = ['apple', 'banana', 'cherry'];
fruits.add('date');
fruits.remove('banana');
fruits[0];               // 'apple'
fruits.length;           // 4

// List methods
fruits.first;            // First element
fruits.last;             // Last element
fruits.isEmpty;          // false
fruits.contains('apple'); // true

// Maps (dictionaries)
Map<String, int> ages = {
  'Alice': 25,
  'Bob': 30,
  'Charlie': 35
};

ages['Alice'];           // 25
ages['David'] = 40;      // Add new
ages.keys;               // All keys
ages.values;             // All values

// Sets (unique values)
Set<int> numbers = {1, 2, 3, 3};  // {1, 2, 3}

**Functions:**

// Basic function
String greet(String name) {
  return 'Hello, $name!';
}

// Arrow function (one-liner)
String greet(String name) => 'Hello, $name!';

// Optional parameters
void log(String message, [String? prefix]) {
  print('$prefix: $message');
}

// Named parameters
void createUser({required String name, int age = 0}) {
  print('User: $name, Age: $age');
}

createUser(name: 'Alice', age: 25);

// Anonymous functions (lambdas)
var numbers = [1, 2, 3, 4, 5];
numbers.forEach((num) => print(num));

var doubled = numbers.map((n) => n * 2).toList();

**Control Flow:**

// If-else
if (score >= 90) {
  print('A');
} else if (score >= 80) {
  print('B');
} else {
  print('C');
}

// Ternary operator
String result = score >= 60 ? 'Pass' : 'Fail';

// Switch
switch (grade) {
  case 'A':
    print('Excellent');
    break;
  case 'B':
    print('Good');
    break;
  default:
    print('Other');
}

**Loops:**

// For loop
for (var i = 0; i < 5; i++) {
  print(i);
}

// For-in loop
for (var fruit in fruits) {
  print(fruit);
}

// While loop
while (count > 0) {
  print(count);
  count--;
}

// Do-while loop
do {
  print(count);
  count++;
} while (count < 5);

**Classes and Objects:**

class Person {
  // Properties
  String name;
  int age;

  // Constructor
  Person(this.name, this.age);

  // Named constructor
  Person.guest() : name = 'Guest', age = 0;

  // Method
  void introduce() {
    print('Hi, I am $name, $age years old');
  }

  // Getter
  String get info => '$name ($age)';

  // Setter
  set updateAge(int newAge) {
    if (newAge > 0) age = newAge;
  }
}

// Usage
var person = Person('Alice', 25);
person.introduce();

// Named constructor
var guest = Person.guest();

**Inheritance:**

class Employee extends Person {
  String jobTitle;

  Employee(String name, int age, this.jobTitle) : super(name, age);

  @override
  void introduce() {
    super.introduce();
    print('I work as a $jobTitle');
  }
}

**Async Programming:**

// Future (represents a value that will be available later)
Future<String> fetchData() async {
  await Future.delayed(Duration(seconds: 2));
  return 'Data loaded';
}

// Using async/await
void loadData() async {
  print('Loading...');
  String data = await fetchData();
  print(data);
}

// Error handling
try {
  var result = await riskyOperation();
} catch (e) {
  print('Error: $e');
} finally {
  print('Cleanup');
}

**Null Safety:**

// Non-nullable by default
String name = 'Alice';  // Cannot be null
// name = null;  // Error!

// Nullable type
String? nickname;  // Can be null
nickname = null;   // OK

// Null-aware operators
String? name;
String display = name ?? 'Guest';  // Use 'Guest' if null

name?.toUpperCase();  // Only call if not null

List<String>? items;
int count = items?.length ?? 0;

**List Operations (Advanced):**

var numbers = [1, 2, 3, 4, 5];

// Map
var doubled = numbers.map((n) => n * 2).toList();

// Filter
var evens = numbers.where((n) => n % 2 == 0).toList();

// Reduce
var sum = numbers.reduce((a, b) => a + b);

// Any/Every
bool hasEven = numbers.any((n) => n % 2 == 0);
bool allPositive = numbers.every((n) => n > 0);

**Enums:**

enum Status { pending, active, completed, cancelled }

Status current = Status.active;

if (current == Status.active) {
  print('Currently active');
}

**Extension Methods:**

extension StringExtension on String {
  String capitalize() {
    return '\${this[0].toUpperCase()}\${this.substring(1)}';
  }
}

var text = 'hello'.capitalize();  // 'Hello'

**Best Practices:**

1. Use const for compile-time constants
2. Use final for runtime constants
3. Enable null safety
4. Use meaningful variable names
5. Follow Dart naming conventions
6. Use cascade notation (..) for multiple operations
7. Prefer expression bodies (=>) for simple functions

Practice Dart on DartPad (dartpad.dev) - no installation needed!`,
        quiz: [
          {
            question: 'Dart is?',
            options: ['Compiled and typed', 'Only interpreted', 'Only markup', 'Only database'],
            correctIndex: 0
          },
          {
            question: 'Which keyword declares a constant in Dart?',
            options: ['let', 'const', 'final', 'constant'],
            correctIndex: 1
          },
          {
            question: 'A function returns using?',
            options: ['send', 'return', 'yield', 'give'],
            correctIndex: 1
          }
        ],
        order: 2
      },
      {
        title: 'Building UI',
        description: 'Create beautiful interfaces',
        duration: '8 hours',
        content: `Flutter UI Development - Everything is a Widget!

In Flutter, EVERYTHING is a widget. Understanding widgets is the key to building beautiful UIs.

**Widget Tree:**

Every Flutter app is a tree of widgets:

MaterialApp
  └── Scaffold
      ├── AppBar
      │   └── Text
      └── Body
          └── Column
              ├── Text
              ├── Image
              └── Button

**Stateless vs Stateful Widgets:**

**StatelessWidget:** Immutable, doesn't change

class Hello extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Text('Hello World');
  }
}

**StatefulWidget:** Can change over time

class Counter extends StatefulWidget {
  @override
  _CounterState createState() => _CounterState();
}

class _CounterState extends State<Counter> {
  int count = 0;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text('Count: $count'),
        ElevatedButton(
          onPressed: () {
            setState(() {
              count++;
            });
          },
          child: Text('Increment'),
        ),
      ],
    );
  }
}

**Common Layout Widgets:**

**1. Container:** Box model

Container(
  width: 200,
  height: 100,
  padding: EdgeInsets.all(16),
  margin: EdgeInsets.symmetric(vertical: 8),
  decoration: BoxDecoration(
    color: Colors.blue,
    borderRadius: BorderRadius.circular(10),
    boxShadow: [
      BoxShadow(
        color: Colors.black26,
        blurRadius: 5,
        offset: Offset(0, 2),
      ),
    ],
  ),
  child: Text('Hello'),
)

**2. Row:** Horizontal layout

Row(
  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
  crossAxisAlignment: CrossAxisAlignment.center,
  children: [
    Icon(Icons.star),
    Text('Rating'),
    Text('4.5'),
  ],
)

**3. Column:** Vertical layout

Column(
  mainAxisAlignment: MainAxisAlignment.center,
  children: [
    Text('Title'),
    SizedBox(height: 10),
    Text('Subtitle'),
    ElevatedButton(
      onPressed: () {},
      child: Text('Click'),
    ),
  ],
)

**4. Stack:** Overlapping widgets

Stack(
  children: [
    Image.network('url'),
    Positioned(
      bottom: 10,
      right: 10,
      child: Icon(Icons.favorite),
    ),
  ],
)

**5. ListView:** Scrollable list

ListView(
  children: [
    ListTile(
      leading: Icon(Icons.person),
      title: Text('John Doe'),
      subtitle: Text('Software Engineer'),
      trailing: Icon(Icons.arrow_forward),
    ),
    ListTile(
      leading: Icon(Icons.person),
      title: Text('Jane Smith'),
      subtitle: Text('Designer'),
    ),
  ],
)

// ListView.builder for dynamic lists
ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) {
    return Card(
      child: ListTile(title: Text(items[index])),
    );
  },
)

**6. GridView:** Grid layout

GridView.count(
  crossAxisCount: 2,  // 2 columns
  children: List.generate(6, (index) {
    return Card(
      child: Center(child: Text('Item $index')),
    );
  }),
)

**Material Design Widgets:**

**Scaffold:** Basic material design layout

Scaffold(
  appBar: AppBar(
    title: Text('My App'),
    actions: [
      IconButton(
        icon: Icon(Icons.search),
        onPressed: () {},
      ),
    ],
  ),
  body: Center(child: Text('Content')),
  floatingActionButton: FloatingActionButton(
    onPressed: () {},
    child: Icon(Icons.add),
  ),
  drawer: Drawer(
    child: ListView(
      children: [
        DrawerHeader(
          child: Text('Menu'),
          decoration: BoxDecoration(color: Colors.blue),
        ),
        ListTile(
          title: Text('Home'),
          onTap: () {},
        ),
      ],
    ),
  ),
)

**Buttons:**

// Elevated Button (raised)
ElevatedButton(
  onPressed: () {
    print('Pressed');
  },
  child: Text('Elevated'),
  style: ElevatedButton.styleFrom(
    primary: Colors.blue,
    padding: EdgeInsets.symmetric(horizontal: 50, vertical: 15),
  ),
)

// Text Button (flat)
TextButton(
  onPressed: () {},
  child: Text('Text Button'),
)

// Icon Button
IconButton(
  icon: Icon(Icons.favorite),
  onPressed: () {},
  color: Colors.red,
)

// Outlined Button
OutlinedButton(
  onPressed: () {},
  child: Text('Outlined'),
)

**Input Widgets:**

// TextField
TextField(
  decoration: InputDecoration(
    labelText: 'Enter name',
    hintText: 'John Doe',
    prefixIcon: Icon(Icons.person),
    border: OutlineInputBorder(),
  ),
  onChanged: (value) {
    print(value);
  },
)

// Checkbox
Checkbox(
  value: isChecked,
  onChanged: (bool? value) {
    setState(() {
      isChecked = value!;
    });
  },
)

// Radio Button
Radio(
  value: 1,
  groupValue: selectedValue,
  onChanged: (value) {
    setState(() {
      selectedValue = value as int;
    });
  },
)

// Switch
Switch(
  value: isSwitched,
  onChanged: (value) {
    setState(() {
      isSwitched = value;
    });
  },
)

// Slider
Slider(
  value: sliderValue,
  min: 0,
  max: 100,
  divisions: 10,
  label: sliderValue.round().toString(),
  onChanged: (value) {
    setState(() {
      sliderValue = value;
    });
  },
)

**Images:**

// Network image
Image.network('https://example.com/image.jpg')

// Asset image
Image.asset('images/logo.png')

// With properties
Image.network(
  'url',
  width: 200,
  height: 200,
  fit: BoxFit.cover,
)

**Icons:**

Icon(Icons.home, size: 30, color: Colors.blue)
Icon(Icons.favorite_border)
Icon(Icons.shopping_cart)

**Card Widget:**

Card(
  elevation: 4,
  margin: EdgeInsets.all(8),
  child: Padding(
    padding: EdgeInsets.all(16),
    child: Column(
      children: [
        Text('Title', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
        SizedBox(height: 8),
        Text('This is the card content'),
      ],
    ),
  ),
)

**Styling Text:**

Text(
  'Hello Flutter',
  style: TextStyle(
    fontSize: 24,
    fontWeight: FontWeight.bold,
    color: Colors.blue,
    letterSpacing: 1.5,
    decoration: TextDecoration.underline,
    fontStyle: FontStyle.italic,
  ),
)

**Padding and Margin:**

Padding(
  padding: EdgeInsets.all(16),  // All sides
  child: Text('Padded'),
)

Padding(
  padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
  child: Text('Padded'),
)

Padding(
  padding: EdgeInsets.only(left: 10, top: 20),
  child: Text('Padded'),
)

**SizedBox:** Add spacing

SizedBox(height: 20)  // Vertical space
SizedBox(width: 20)   // Horizontal space

SizedBox(
  width: 200,
  height: 100,
  child: ElevatedButton(
    onPressed: () {},
    child: Text('Fixed Size Button'),
  ),
)

**Expanded and Flexible:**

// Expanded: Take all available space
Row(
  children: [
    Expanded(
      child: Container(color: Colors.red, height: 100),
    ),
    Container(width: 100, height: 100, color: Colors.blue),
  ],
)

// Flexible with flex factor
Row(
  children: [
    Flexible(flex: 2, child: Container(color: Colors.red)),
    Flexible(flex: 1, child: Container(color: Colors.blue)),
  ],
)

**Alignment:**

Align(
  alignment: Alignment.center,
  child: Text('Centered'),
)

Center(child: Text('Centered'))

**Complete Example - Login Screen:**

class LoginPage extends StatefulWidget {
  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _formKey = GlobalKey<FormState>();
  String email = '';
  String password = '';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Login')),
      body: Padding(
        padding: EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              TextFormField(
                decoration: InputDecoration(
                  labelText: 'Email',
                  prefixIcon: Icon(Icons.email),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter email';
                  }
                  return null;
                },
                onSaved: (value) => email = value!,
              ),
              SizedBox(height: 16),
              TextFormField(
                decoration: InputDecoration(
                  labelText: 'Password',
                  prefixIcon: Icon(Icons.lock),
                ),
                obscureText: true,
                validator: (value) {
                  if (value == null || value.length < 6) {
                    return 'Password must be at least 6 characters';
                  }
                  return null;
                },
                onSaved: (value) => password = value!,
              ),
              SizedBox(height: 24),
              ElevatedButton(
                onPressed: () {
                  if (_formKey.currentState!.validate()) {
                    _formKey.currentState!.save();
                    print('Email: $email, Password: $password');
                  }
                },
                child: Text('Login'),
                style: ElevatedButton.styleFrom(
                  minimumSize: Size(double.infinity, 50),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

**Best Practices:**

1. Extract widgets into separate classes
2. Use const constructors when possible
3. Keep build methods small
4. Use ListView.builder for long lists
5. Cache expensive operations
6. Use keys for list items
7. Implement proper state management

Master these widgets and you can build any UI you imagine! 🎨`,
        quiz: [
          {
            question: 'Flutter UI building blocks are called?',
            options: ['Widgets', 'Modules', 'Controllers', 'Routes'],
            correctIndex: 0
          },
          {
            question: 'Which widget arranges children vertically?',
            options: ['Row', 'Column', 'Stack', 'ListTile'],
            correctIndex: 1
          },
          {
            question: 'StatefulWidget is used when?',
            options: ['UI never changes', 'UI changes over time', 'Only for CSS', 'Only for DB'],
            correctIndex: 1
          }
        ],
        order: 3
      }
    ]
  },
  {
    title: 'AWS Cloud Practitioner Essentials',
    description: 'Master cloud computing concepts with Amazon Web Services',
    category: 'Cloud Computing',
    difficulty: 'Beginner',
    duration: '25 hours',
    instructor: 'Dr. Jennifer Martinez',
    modules: [
      {
        title: 'Introduction to Cloud Computing',
        description: 'Understanding cloud concepts',
        duration: '3 hours',
        content: 'Cloud models, deployment types, and benefits',
        quiz: [
          {
            question: 'What does IaaS stand for?',
            options: ['Internet as a Service', 'Infrastructure as a Service', 'Information as a Service', 'Integration as a Service'],
            correctIndex: 1
          },
          {
            question: 'Which is a benefit of cloud computing?',
            options: ['High upfront costs', 'Limited scalability', 'Pay-as-you-go pricing', 'Manual maintenance'],
            correctIndex: 2
          },
          {
            question: 'Public cloud is?',
            options: ['Only for government', 'Shared infrastructure', 'Only on-premise', 'Not accessible'],
            correctIndex: 1
          }
        ],
        order: 1
      },
      {
        title: 'AWS Core Services',
        description: 'Explore EC2, S3, and RDS',
        duration: '6 hours',
        content: 'Compute, storage, and database services',
        quiz: [
          {
            question: 'EC2 stands for?',
            options: ['Elastic Compute Cloud', 'Easy Cloud Configuration', 'Extended Cloud Computing', 'Elastic Container Cloud'],
            correctIndex: 0
          },
          {
            question: 'S3 is used for?',
            options: ['Compute power', 'Object storage', 'Email service', 'Video streaming only'],
            correctIndex: 1
          },
          {
            question: 'RDS stands for?',
            options: ['Rapid Data Storage', 'Relational Database Service', 'Real-time Data System', 'Remote Desktop Service'],
            correctIndex: 1
          }
        ],
        order: 2
      },
      {
        title: 'Security and Compliance',
        description: 'AWS security best practices',
        duration: '4 hours',
        content: 'IAM, security groups, and encryption',
        quiz: [
          {
            question: 'IAM is used for?',
            options: ['Storage', 'Identity and access management', 'Network routing', 'DNS'],
            correctIndex: 1
          },
          {
            question: 'What is the principle of least privilege?',
            options: ['Give all permissions', 'Give minimum required permissions', 'No permissions', 'Admin only'],
            correctIndex: 1
          },
          {
            question: 'Security groups act as?',
            options: ['User groups', 'Virtual firewalls', 'Storage buckets', 'Databases'],
            correctIndex: 1
          }
        ],
        order: 3
      }
    ]
  },
  {
    title: 'Cybersecurity Fundamentals',
    description: 'Learn essential security concepts and practices',
    category: 'Cybersecurity',
    difficulty: 'Intermediate',
    duration: '32 hours',
    instructor: 'Prof. Michael Thompson',
    modules: [
      {
        title: 'Security Basics',
        description: 'Core security principles',
        duration: '4 hours',
        content: 'CIA triad, threats, and vulnerabilities',
        quiz: [
          {
            question: 'CIA in security stands for?',
            options: ['Central Intelligence Agency', 'Confidentiality, Integrity, Availability', 'Computer Internet Access', 'Cloud Infrastructure Access'],
            correctIndex: 1
          },
          {
            question: 'What is a vulnerability?',
            options: ['A feature', 'A weakness that can be exploited', 'An antivirus', 'A firewall'],
            correctIndex: 1
          },
          {
            question: 'Phishing is a type of?',
            options: ['Hardware', 'Social engineering attack', 'Encryption', 'Database'],
            correctIndex: 1
          }
        ],
        order: 1
      },
      {
        title: 'Network Security',
        description: 'Protecting network infrastructure',
        duration: '6 hours',
        content: 'Firewalls, VPNs, and intrusion detection',
        quiz: [
          {
            question: 'A firewall is used to?',
            options: ['Speed up internet', 'Block unauthorized access', 'Store files', 'Create websites'],
            correctIndex: 1
          },
          {
            question: 'VPN stands for?',
            options: ['Virtual Private Network', 'Very Public Network', 'Visual Programming Node', 'Variable Port Network'],
            correctIndex: 0
          },
          {
            question: 'IDS stands for?',
            options: ['Internet Data Storage', 'Intrusion Detection System', 'Internal Database Service', 'Infinite Download Speed'],
            correctIndex: 1
          }
        ],
        order: 2
      },
      {
        title: 'Cryptography Basics',
        description: 'Understanding encryption',
        duration: '5 hours',
        content: 'Symmetric, asymmetric, and hashing',
        quiz: [
          {
            question: 'Encryption is used to?',
            options: ['Speed up data', 'Protect data confidentiality', 'Delete data', 'Compress data only'],
            correctIndex: 1
          },
          {
            question: 'Which uses a key pair?',
            options: ['Symmetric encryption', 'Asymmetric encryption', 'Hashing', 'Compression'],
            correctIndex: 1
          },
          {
            question: 'A hash function is?',
            options: ['Reversible', 'One-way', 'Bidirectional', 'Deletable'],
            correctIndex: 1
          }
        ],
        order: 3
      }
    ]
  },
  {
    title: 'Node.js Backend Development',
    description: 'Build scalable server-side applications with Node.js',
    category: 'Web Development',
    difficulty: 'Intermediate',
    duration: '42 hours',
    instructor: 'Prof. Lisa Anderson',
    modules: [
      {
        title: 'Node.js Fundamentals',
        description: 'Introduction to Node.js',
        duration: '5 hours',
        content: 'Event loop, modules, and npm',
        quiz: [
          {
            question: 'Node.js is built on?',
            options: ['Python engine', 'V8 JavaScript engine', 'Java VM', 'Ruby runtime'],
            correctIndex: 1
          },
          {
            question: 'npm is used for?',
            options: ['Package management', 'Only testing', 'Only deployment', 'Database queries'],
            correctIndex: 0
          },
          {
            question: 'Node.js is?',
            options: ['Single-threaded', 'Multi-threaded only', 'Not event-driven', 'Only for frontend'],
            correctIndex: 0
          }
        ],
        order: 1
      },
      {
        title: 'Express Framework',
        description: 'Building APIs with Express',
        duration: '7 hours',
        content: 'Routing, middleware, and REST APIs',
        quiz: [
          {
            question: 'Express is a?',
            options: ['Database', 'Web framework', 'Testing tool', 'CSS library'],
            correctIndex: 1
          },
          {
            question: 'Middleware in Express is?',
            options: ['A database', 'Functions that process requests', 'A frontend library', 'A CSS framework'],
            correctIndex: 1
          },
          {
            question: 'RESTful API uses?',
            options: ['Only GET', 'HTTP methods (GET, POST, PUT, DELETE)', 'Only databases', 'Only HTML'],
            correctIndex: 1
          }
        ],
        order: 2
      },
      {
        title: 'MongoDB Integration',
        description: 'Working with MongoDB',
        duration: '6 hours',
        content: 'Mongoose, schemas, and CRUD operations',
        quiz: [
          {
            question: 'MongoDB is a?',
            options: ['Relational database', 'NoSQL document database', 'Cache only', 'Frontend tool'],
            correctIndex: 1
          },
          {
            question: 'Mongoose is?',
            options: ['A web server', 'An ODM library', 'A CSS framework', 'A testing tool'],
            correctIndex: 1
          },
          {
            question: 'CRUD stands for?',
            options: ['Create Read Update Delete', 'Copy Remove Update Data', 'Connect Read Upload Delete', 'Cache Retrieve Use Delete'],
            correctIndex: 0
          }
        ],
        order: 3
      }
    ]
  },
  {
    title: 'Deep Learning with TensorFlow',
    description: 'Master neural networks and deep learning',
    category: 'Machine Learning',
    difficulty: 'Advanced',
    duration: '50 hours',
    instructor: 'Dr. Rachel Park',
    modules: [
      {
        title: 'Neural Networks Basics',
        description: 'Understanding neural networks',
        duration: '6 hours',
        content: 'Neurons, layers, activation functions',
        quiz: [
          {
            question: 'A neural network is inspired by?',
            options: ['Computers', 'Human brain', 'Plants', 'Buildings'],
            correctIndex: 1
          },
          {
            question: 'Activation function is used to?',
            options: ['Store data', 'Introduce non-linearity', 'Delete weights', 'Format output only'],
            correctIndex: 1
          },
          {
            question: 'Backpropagation is used for?',
            options: ['Prediction', 'Training/updating weights', 'Data cleaning', 'Visualization'],
            correctIndex: 1
          }
        ],
        order: 1
      },
      {
        title: 'TensorFlow Essentials',
        description: 'Getting started with TensorFlow',
        duration: '8 hours',
        content: 'Tensors, operations, and models',
        quiz: [
          {
            question: 'TensorFlow is mainly for?',
            options: ['Word processing', 'Machine learning', 'Image editing', 'Audio recording'],
            correctIndex: 1
          },
          {
            question: 'A tensor is?',
            options: ['A string', 'A multi-dimensional array', 'A database', 'A website'],
            correctIndex: 1
          },
          {
            question: 'Keras is?',
            options: ['A database', 'High-level API for TensorFlow', 'A CSS library', 'A testing tool'],
            correctIndex: 1
          }
        ],
        order: 2
      }
    ]
  },
  {
    title: 'iOS Development with Swift',
    description: 'Create native iOS applications',
    category: 'Mobile Development',
    difficulty: 'Intermediate',
    duration: '44 hours',
    instructor: 'Prof. James Wilson',
    modules: [
      {
        title: 'Swift Programming',
        description: 'Learn Swift language',
        duration: '7 hours',
        content: 'Syntax, optionals, and protocols',
        quiz: [
          {
            question: 'Swift is developed by?',
            options: ['Google', 'Apple', 'Microsoft', 'Facebook'],
            correctIndex: 1
          },
          {
            question: 'Optionals in Swift are used to?',
            options: ['Speed up code', 'Handle absence of value', 'Create loops', 'Format strings'],
            correctIndex: 1
          },
          {
            question: 'A protocol in Swift is like?',
            options: ['A class', 'An interface/contract', 'A variable', 'A loop'],
            correctIndex: 1
          }
        ],
        order: 1
      },
      {
        title: 'UIKit Basics',
        description: 'Building user interfaces',
        duration: '8 hours',
        content: 'Views, view controllers, and Auto Layout',
        quiz: [
          {
            question: 'UIKit is used for?',
            options: ['Backend logic', 'Building iOS UI', 'Database queries', 'Testing only'],
            correctIndex: 1
          },
          {
            question: 'Auto Layout helps with?',
            options: ['Automatic deployment', 'Responsive UI design', 'Database migrations', 'API calls'],
            correctIndex: 1
          },
          {
            question: 'A view controller manages?',
            options: ['Databases', 'A screen/view hierarchy', 'Network only', 'Files only'],
            correctIndex: 1
          }
        ],
        order: 2
      }
    ]
  }
];

const extraCourses = [
  {
    title: 'DevOps Fundamentals with CI/CD',
    description: 'Learn practical DevOps workflows, automation, and release pipelines.',
    category: 'Cloud Computing',
    difficulty: 'Intermediate',
    duration: '20 hours',
    instructor: 'Eng. Robert Miles',
    modules: [
      {
        title: 'DevOps Foundations',
        description: 'Understand culture, collaboration, and delivery flow.',
        duration: '3 hours',
        content: 'DevOps combines development and operations to deliver software faster and more reliably.',
        quiz: [
          {
            question: 'What is a key DevOps objective?',
            options: ['Slow releases', 'Faster reliable delivery', 'Manual everything', 'No testing'],
            correctIndex: 1
          },
          {
            question: 'Which practice supports continuous feedback?',
            options: ['Monitoring', 'Ignoring logs', 'Weekly deploy only', 'Big-bang releases'],
            correctIndex: 0
          },
          {
            question: 'DevOps encourages collaboration between:',
            options: ['Only developers', 'Only admins', 'Dev and Ops teams', 'Customers and sales only'],
            correctIndex: 2
          }
        ],
        order: 1
      },
      {
        title: 'CI/CD Pipelines',
        description: 'Build, test, and deploy automatically.',
        duration: '4 hours',
        content: 'CI/CD pipelines automate build, test, and deployment stages.',
        quiz: [
          {
            question: 'CI stands for:',
            options: ['Continuous Integration', 'Code Inspection', 'Cloud Instance', 'Centralized Infrastructure'],
            correctIndex: 0
          },
          {
            question: 'A pipeline should run tests:',
            options: ['Never', 'Only monthly', 'On every meaningful change', 'After production incidents only'],
            correctIndex: 2
          },
          {
            question: 'CD most commonly means:',
            options: ['Continuous Delivery/Deployment', 'Code Deletion', 'Container Design', 'Centralized Development'],
            correctIndex: 0
          }
        ],
        order: 2
      },
      {
        title: 'Infrastructure as Code',
        description: 'Provision environments with repeatable definitions.',
        duration: '3 hours',
        content: 'IaC helps teams version and automate infrastructure setup.',
        quiz: [
          {
            question: 'IaC primarily improves:',
            options: ['Randomness', 'Repeatability', 'Manual effort', 'Downtime windows'],
            correctIndex: 1
          },
          {
            question: 'IaC files should be stored in:',
            options: ['Version control', 'Email threads', 'Screenshots', 'Spreadsheets only'],
            correctIndex: 0
          },
          {
            question: 'A key IaC benefit is:',
            options: ['Configuration drift reduction', 'More manual changes', 'No automation', 'No reviews'],
            correctIndex: 0
          }
        ],
        order: 3
      }
    ]
  },
  {
    title: 'Practical SQL for Data Analytics',
    description: 'Use SQL queries for reporting, insights, and dashboards.',
    category: 'Data Science',
    difficulty: 'Beginner',
    duration: '18 hours',
    instructor: 'Dr. Elena Park',
    modules: [
      {
        title: 'SQL Basics',
        description: 'SELECT, WHERE, ORDER BY and LIMIT.',
        duration: '3 hours',
        content: 'SQL retrieves and transforms structured data from relational databases.',
        quiz: [
          {
            question: 'Which clause filters rows?',
            options: ['ORDER BY', 'WHERE', 'GROUP BY', 'FROM'],
            correctIndex: 1
          },
          {
            question: 'Which statement reads data?',
            options: ['INSERT', 'UPDATE', 'SELECT', 'DELETE'],
            correctIndex: 2
          },
          {
            question: 'LIMIT is used to:',
            options: ['Rename columns', 'Sort data', 'Restrict returned rows', 'Create tables'],
            correctIndex: 2
          }
        ],
        order: 1
      },
      {
        title: 'Joins and Aggregations',
        description: 'Combine tables and summarize data.',
        duration: '4 hours',
        content: 'JOIN and GROUP BY enable relational analysis and metrics.',
        quiz: [
          {
            question: 'Which join returns matching rows from both tables?',
            options: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN'],
            correctIndex: 0
          },
          {
            question: 'COUNT() is a:',
            options: ['String function', 'Aggregate function', 'Date function', 'Window filter'],
            correctIndex: 1
          },
          {
            question: 'GROUP BY is used with:',
            options: ['Aggregations', 'Table creation', 'Index drops', 'Transaction rollback'],
            correctIndex: 0
          }
        ],
        order: 2
      },
      {
        title: 'Analytical Query Patterns',
        description: 'Write practical business analytics queries.',
        duration: '3 hours',
        content: 'Build retention, conversion, and cohort style queries.',
        quiz: [
          {
            question: 'Which clause is evaluated after GROUP BY for filtering groups?',
            options: ['WHERE', 'HAVING', 'ORDER BY', 'LIMIT'],
            correctIndex: 1
          },
          {
            question: 'A common KPI query pattern is:',
            options: ['DELETE all rows', 'Aggregate over time', 'Drop indexes first', 'Disable constraints'],
            correctIndex: 1
          },
          {
            question: 'Good analytical SQL should be:',
            options: ['Unreadable', 'Deterministic and reviewed', 'Randomized', 'Unversioned'],
            correctIndex: 1
          }
        ],
        order: 3
      }
    ]
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});
    await Progress.deleteMany({});
    console.log('Cleared existing data');

    // Hash passwords and create users
    const allUsers = [...sampleUsers];
    const usersWithHashedPasswords = await Promise.all(
      allUsers.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return { ...user, password: hashedPassword };
      })
    );

    const createdUsers = await User.insertMany(usersWithHashedPasswords);
    console.log(`Created ${createdUsers.length} users`);

    // Create courses
    const allCourses = [...sampleCourses, ...extraCourses];
    const coursesWithCreator = allCourses.map(course => ({
      ...course,
      createdBy: createdUsers[0]._id // Assign to admin
    }));

    const createdCourses = await Course.insertMany(coursesWithCreator);
    console.log(`Created ${createdCourses.length} courses`);

    // Create sample progress records so charts/analytics/certificates have data
    const admin = createdUsers[0];
    const john = createdUsers[1];
    const jane = createdUsers[2];
    const alex = createdUsers[3];
    const maria = createdUsers[4];
    const david = createdUsers[5];
    const sarah = createdUsers[6];
    const tom = createdUsers[7];
    const emily = createdUsers[8];
    const priya = createdUsers[9];
    const arun = createdUsers[10];
    const nisha = createdUsers[11];

    // Enroll users in various courses
    john.enrolledCourses = [createdCourses[0]._id, createdCourses[4]._id]; // Web Dev, Flutter
    jane.enrolledCourses = [createdCourses[1]._id, createdCourses[2]._id]; // Python, React
    alex.enrolledCourses = [createdCourses[5]._id, createdCourses[6]._id, createdCourses[3]._id]; // AWS, Cybersecurity, ML
    maria.enrolledCourses = [createdCourses[0]._id, createdCourses[1]._id, createdCourses[7]._id]; // Web Dev, Python, Node.js
    david.enrolledCourses = [createdCourses[4]._id, createdCourses[9]._id]; // Flutter, iOS
    sarah.enrolledCourses = [createdCourses[1]._id, createdCourses[8]._id, createdCourses[5]._id]; // Python, Deep Learning, AWS
    tom.enrolledCourses = [createdCourses[6]._id, createdCourses[5]._id]; // Cybersecurity, AWS
    emily.enrolledCourses = [createdCourses[3]._id, createdCourses[1]._id]; // ML, Python
    priya.enrolledCourses = [createdCourses[10]._id, createdCourses[5]._id]; // DevOps, AWS
    arun.enrolledCourses = [createdCourses[11]._id, createdCourses[6]._id]; // SQL, Cybersecurity
    nisha.enrolledCourses = [createdCourses[2]._id, createdCourses[10]._id]; // React, DevOps

    await Promise.all([
      john.save(),
      jane.save(),
      alex.save(),
      maria.save(),
      david.save(),
      sarah.save(),
      tom.save(),
      emily.save(),
      priya.save(),
      arun.save(),
      nisha.save()
    ]);

    // John: 50% on Web Dev, 20% on Flutter
    await Progress.create({
      userId: john._id,
      courseId: createdCourses[0]._id,
      completedModules: [
        { moduleId: String(createdCourses[0].modules[0]._id) },
        { moduleId: String(createdCourses[0].modules[1]._id) }
      ],
      progressPercentage: 50,
      status: 'in-progress',
      quizResults: [
        { moduleId: String(createdCourses[0].modules[0]._id), score: 3, total: 3, passed: true, attemptedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) }
      ]
    });
    await Progress.create({
      userId: john._id,
      courseId: createdCourses[4]._id,
      completedModules: [{ moduleId: String(createdCourses[4].modules[0]._id) }],
      progressPercentage: 33,
      status: 'in-progress'
    });

    // Jane: completed Python DS, 33% React
    await Progress.create({
      userId: jane._id,
      courseId: createdCourses[1]._id,
      completedModules: createdCourses[1].modules.map((m) => ({ moduleId: String(m._id) })),
      progressPercentage: 100,
      status: 'completed',
      completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      certificateId: makeCertificateId(),
      certificateIssuedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      quizResults: [
        { moduleId: String(createdCourses[1].modules[0]._id), score: 3, total: 3, passed: true, attemptedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
        { moduleId: String(createdCourses[1].modules[1]._id), score: 2, total: 3, passed: true, attemptedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) }
      ]
    });
    await Progress.create({
      userId: jane._id,
      courseId: createdCourses[2]._id,
      completedModules: [{ moduleId: String(createdCourses[2].modules[0]._id) }],
      progressPercentage: 33,
      status: 'in-progress',
      quizResults: [
        { moduleId: String(createdCourses[2].modules[0]._id), score: 3, total: 3, passed: true, attemptedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) }
      ]
    });

    // Alex: completed AWS and Cybersecurity, 50% ML
    await Progress.create({
      userId: alex._id,
      courseId: createdCourses[5]._id,
      completedModules: createdCourses[5].modules.map((m) => ({ moduleId: String(m._id) })),
      progressPercentage: 100,
      status: 'completed',
      completedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      certificateId: makeCertificateId(),
      certificateIssuedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      quizResults: [
        { moduleId: String(createdCourses[5].modules[0]._id), score: 3, total: 3, passed: true, attemptedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000) },
        { moduleId: String(createdCourses[5].modules[1]._id), score: 3, total: 3, passed: true, attemptedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000) }
      ]
    });
    await Progress.create({
      userId: alex._id,
      courseId: createdCourses[6]._id,
      completedModules: createdCourses[6].modules.map((m) => ({ moduleId: String(m._id) })),
      progressPercentage: 100,
      status: 'completed',
      completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      quizResults: [
        { moduleId: String(createdCourses[6].modules[0]._id), score: 3, total: 3, passed: true, attemptedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      ]
    });
    await Progress.create({
      userId: alex._id,
      courseId: createdCourses[3]._id,
      completedModules: [{ moduleId: String(createdCourses[3].modules[0]._id) }],
      progressPercentage: 50,
      status: 'in-progress'
    });

    // Maria: 75% Web Dev, completed Python, 33% Node.js
    await Progress.create({
      userId: maria._id,
      courseId: createdCourses[0]._id,
      completedModules: createdCourses[0].modules.slice(0, 3).map((m) => ({ moduleId: String(m._id) })),
      progressPercentage: 75,
      status: 'in-progress',
      quizResults: [
        { moduleId: String(createdCourses[0].modules[0]._id), score: 2, total: 3, passed: true, attemptedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000) },
        { moduleId: String(createdCourses[0].modules[1]._id), score: 3, total: 3, passed: true, attemptedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      ]
    });
    await Progress.create({
      userId: maria._id,
      courseId: createdCourses[1]._id,
      completedModules: createdCourses[1].modules.map((m) => ({ moduleId: String(m._id) })),
      progressPercentage: 100,
      status: 'completed',
      completedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
    });
    await Progress.create({
      userId: maria._id,
      courseId: createdCourses[7]._id,
      completedModules: [{ moduleId: String(createdCourses[7].modules[0]._id) }],
      progressPercentage: 33,
      status: 'in-progress'
    });

    // David: 66% Flutter, 0% iOS (just enrolled)
    await Progress.create({
      userId: david._id,
      courseId: createdCourses[4]._id,
      completedModules: createdCourses[4].modules.slice(0, 2).map((m) => ({ moduleId: String(m._id) })),
      progressPercentage: 66,
      status: 'in-progress',
      quizResults: [
        { moduleId: String(createdCourses[4].modules[0]._id), score: 3, total: 3, passed: true, attemptedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) }
      ]
    });
    await Progress.create({
      userId: david._id,
      courseId: createdCourses[9]._id,
      completedModules: [],
      progressPercentage: 0,
      status: 'in-progress'
    });

    // Sarah: completed Python, 50% Deep Learning, 66% AWS
    await Progress.create({
      userId: sarah._id,
      courseId: createdCourses[1]._id,
      completedModules: createdCourses[1].modules.map((m) => ({ moduleId: String(m._id) })),
      progressPercentage: 100,
      status: 'completed',
      completedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      certificateId: makeCertificateId(),
      certificateIssuedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      quizResults: [
        { moduleId: String(createdCourses[1].modules[0]._id), score: 3, total: 3, passed: true, attemptedAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000) },
        { moduleId: String(createdCourses[1].modules[1]._id), score: 3, total: 3, passed: true, attemptedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000) }
      ]
    });
    await Progress.create({
      userId: sarah._id,
      courseId: createdCourses[8]._id,
      completedModules: [{ moduleId: String(createdCourses[8].modules[0]._id) }],
      progressPercentage: 50,
      status: 'in-progress'
    });
    await Progress.create({
      userId: sarah._id,
      courseId: createdCourses[5]._id,
      completedModules: createdCourses[5].modules.slice(0, 2).map((m) => ({ moduleId: String(m._id) })),
      progressPercentage: 66,
      status: 'in-progress'
    });

    // Tom: 66% Cybersecurity, 33% AWS
    await Progress.create({
      userId: tom._id,
      courseId: createdCourses[6]._id,
      completedModules: createdCourses[6].modules.slice(0, 2).map((m) => ({ moduleId: String(m._id) })),
      progressPercentage: 66,
      status: 'in-progress',
      quizResults: [
        { moduleId: String(createdCourses[6].modules[0]._id), score: 2, total: 3, passed: true, attemptedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) }
      ]
    });
    await Progress.create({
      userId: tom._id,
      courseId: createdCourses[5]._id,
      completedModules: [{ moduleId: String(createdCourses[5].modules[0]._id) }],
      progressPercentage: 33,
      status: 'in-progress'
    });

    // Emily: 50% ML, 33% Python
    await Progress.create({
      userId: emily._id,
      courseId: createdCourses[3]._id,
      completedModules: [{ moduleId: String(createdCourses[3].modules[0]._id) }],
      progressPercentage: 50,
      status: 'in-progress',
      quizResults: [
        { moduleId: String(createdCourses[3].modules[0]._id), score: 2, total: 3, passed: true, attemptedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) }
      ]
    });
    await Progress.create({
      userId: emily._id,
      courseId: createdCourses[1]._id,
      completedModules: [{ moduleId: String(createdCourses[1].modules[0]._id) }],
      progressPercentage: 33,
      status: 'in-progress'
    });

    // Priya: completed DevOps with certificate, 66% AWS
    await Progress.create({
      userId: priya._id,
      courseId: createdCourses[10]._id,
      completedModules: createdCourses[10].modules.map((m) => ({ moduleId: String(m._id) })),
      progressPercentage: 100,
      status: 'completed',
      completedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      certificateId: makeCertificateId(),
      certificateIssuedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      quizResults: createdCourses[10].modules.map((m, idx) => ({
        moduleId: String(m._id),
        score: 3,
        total: 3,
        passed: true,
        attemptedAt: new Date(Date.now() - (9 - idx) * 24 * 60 * 60 * 1000)
      }))
    });
    await Progress.create({
      userId: priya._id,
      courseId: createdCourses[5]._id,
      completedModules: createdCourses[5].modules.slice(0, 2).map((m) => ({ moduleId: String(m._id) })),
      progressPercentage: 66,
      status: 'in-progress'
    });

    // Arun: completed SQL with certificate, 33% Cybersecurity
    await Progress.create({
      userId: arun._id,
      courseId: createdCourses[11]._id,
      completedModules: createdCourses[11].modules.map((m) => ({ moduleId: String(m._id) })),
      progressPercentage: 100,
      status: 'completed',
      completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      certificateId: makeCertificateId(),
      certificateIssuedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      quizResults: createdCourses[11].modules.map((m, idx) => ({
        moduleId: String(m._id),
        score: idx === 1 ? 2 : 3,
        total: 3,
        passed: true,
        attemptedAt: new Date(Date.now() - (5 - idx) * 24 * 60 * 60 * 1000)
      }))
    });
    await Progress.create({
      userId: arun._id,
      courseId: createdCourses[6]._id,
      completedModules: [{ moduleId: String(createdCourses[6].modules[0]._id) }],
      progressPercentage: 33,
      status: 'in-progress'
    });

    // Nisha: 66% React, 33% DevOps
    await Progress.create({
      userId: nisha._id,
      courseId: createdCourses[2]._id,
      completedModules: createdCourses[2].modules.slice(0, 2).map((m) => ({ moduleId: String(m._id) })),
      progressPercentage: 66,
      status: 'in-progress'
    });
    await Progress.create({
      userId: nisha._id,
      courseId: createdCourses[10]._id,
      completedModules: [{ moduleId: String(createdCourses[10].modules[0]._id) }],
      progressPercentage: 33,
      status: 'in-progress'
    });

    console.log('\n--- Sample Login Credentials ---');
    console.log('Admin: admin@example.com / admin123');
    console.log('Students:');
    console.log('  john@example.com / john123 (Beginner - Web Dev, Flutter)');
    console.log('  jane@example.com / jane123 (Intermediate - Python✓, React)');
    console.log('  alex@example.com / alex123 (Advanced - AWS✓, Cybersecurity✓, ML)');
    console.log('  maria@example.com / maria123 (Intermediate - Web Dev, Python✓, Node.js)');
    console.log('  david@example.com / david123 (Beginner - Flutter, iOS)');
    console.log('  sarah@example.com / sarah123 (Advanced - Python✓, Deep Learning, AWS)');
    console.log('  tom@example.com / tom123 (Intermediate - Cybersecurity, AWS)');
    console.log('  emily@example.com / emily123 (Beginner - ML, Python)');
    console.log('  priya@example.com / priya123 (Intermediate - DevOps, AWS✓ + certificate)');
    console.log('  arun@example.com / arun123 (Beginner - SQL✓ + certificate, Cybersecurity)');
    console.log('  nisha@example.com / nisha123 (Advanced - React, DevOps)');
    console.log('--------------------------------\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
