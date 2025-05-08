
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Welcome = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-university-primary">Project4u</h1>
          <div className="flex space-x-4">
            <Button variant="outline" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link to="/register">Create Account</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-university-primary text-white py-20">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Connecting Students with Faculty Projects</h2>
            <p className="text-xl mb-8">
              Project4u streamlines the final year project selection process, making it easy for students to find and apply to faculty-led projects.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-university-secondary text-university-primary hover:bg-yellow-400" size="lg" asChild>
                <Link to="/register?role=student">I'm a Student</Link>
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10" size="lg" asChild>
                <Link to="/register?role=faculty">I'm a Faculty Member</Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 md:pl-10">
            <img 
              src="https://www.mahindrauniversity.edu.in/wp-content/uploads/2023/04/MU_Building_2_12.webp" 
              alt="University students collaborating" 
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-university-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Browse Projects</h3>
              <p className="text-gray-600">
                Explore a wide range of faculty-created projects that match your interests and skills.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-university-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Apply With Ease</h3>
              <p className="text-gray-600">
                Submit your application directly through the platform with just a few clicks.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-university-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Schedule Meetings</h3>
              <p className="text-gray-600">
                Coordinate and manage project meetings between students and faculty mentors.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button asChild className="bg-university-primary hover:bg-university-accent" size="lg">
              <Link to="/register">Get Started Today</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-lg font-bold text-university-primary">Project4u</h3>
            <p className="mt-2 text-sm text-gray-600">
              Connecting university students and faculty for successful final year projects.
            </p>
            <div className="mt-6">
              <p className="text-sm text-gray-500">
                &copy; {new Date().getFullYear()} mahindrauniversity. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;
