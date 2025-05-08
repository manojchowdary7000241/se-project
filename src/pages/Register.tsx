
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '@/components/layouts/AuthLayout';
import { register } from '@/lib/db';
import { UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/components/ui/use-toast';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [cgpa, setCgpa] = useState<number>(7.0);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const user = register(name, email, password, role, role === UserRole.STUDENT ? cgpa : undefined);
      
      if (user) {
        toast({
          title: "Registration Successful",
          description: "You have successfully registered!",
        });
        
        // Redirect to dashboard
        navigate('/dashboard/redirect');
      } else {
        toast({
          title: "Registration Failed",
          description: "Email may already be in use.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: "An error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AuthLayout title="Create an Account" subtitle="Join us to access university project opportunities">
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1"
              placeholder="Enter your full name"
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1"
              placeholder="Enter your university email"
            />
          </div>
          
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1"
              placeholder="Create a password"
              minLength={6}
            />
          </div>
          
          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-1"
              placeholder="Confirm your password"
              minLength={6}
            />
          </div>
          
          <div>
            <Label>Account Type</Label>
            <RadioGroup
              value={role}
              onValueChange={(value) => setRole(value as UserRole)}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={UserRole.STUDENT} id="student" />
                <Label htmlFor="student" className="cursor-pointer">Student</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={UserRole.FACULTY} id="faculty" />
                <Label htmlFor="faculty" className="cursor-pointer">Faculty</Label>
              </div>
            </RadioGroup>
          </div>
          
          {role === UserRole.STUDENT && (
            <div>
              <Label htmlFor="cgpa">Your CGPA</Label>
              <Input
                id="cgpa"
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={cgpa}
                onChange={(e) => setCgpa(parseFloat(e.target.value))}
                required
                className="mt-1"
                placeholder="Enter your current CGPA"
              />
            </div>
          )}
        </div>
        
        <div>
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Registering...' : 'Register'}
          </Button>
        </div>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-university-primary font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Register;
