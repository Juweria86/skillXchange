import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import {Button} from "@/components/ui/button";
import Badge  from "@/components/ui/Badge";
import { ArrowRight, MessageCircle, Calendar, Users, Star, ArrowUpRight, ArrowLeftRight, Sparkles, GraduationCap } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Logo from "../components/Logo";
import { Link } from "react-router-dom";
import Footer from "@/components/layout/Footer";

const features = [
  {
    title: "Skill Matching",
    desc: "Our intelligent algorithm connects you with the perfect learning partners based on complementary skills and interests.",
    icon: Users,
    color: "bg-[#D7E9F7]",
    iconColor: "text-[#0C4B93]",
  },
  {
    title: "In-App Messaging",
    desc: "Communicate seamlessly with your matches through our built-in messaging system. Plan sessions and share resources easily.",
    icon: MessageCircle,
    color: "bg-[#E5EFF9]",
    iconColor: "text-[#0C4B93]",
  },
  {
    title: "Session Scheduling",
    desc: "Organize your learning journey with our intuitive calendar. Schedule, manage, and track all your skill-swapping sessions.",
    icon: Calendar,
    color: "bg-[#D7E9F7]",
    iconColor: "text-[#0C4B93]",
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Graphic Design Student, MU",
    quote: "SkillXchange helped me learn coding basics while I taught design principles. It's a win-win exchange!",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    stars: 5,
  },
  {
    name: "Michael Ahmed",
    role: "Business Administration, MU",
    quote: "I've made amazing connections and learned practical skills that my university courses don't cover.",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    stars: 5,
  },
  {
    name: "Aisha Hassan",
    role: "Computer Science, MU",
    quote: "Teaching others has improved my own skills dramatically. Plus, I learned photography from an amazing pro!",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    stars: 4,
  },
];

const HomePage = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    // Auto-rotate testimonials
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white py-4 px-6 shadow-sm">
        <div className="container mx-auto max-w-6xl flex justify-between items-center">
          <Logo size="md" />
          
          <div className="flex items-center gap-4">
            <a href="#about"><Button variant="ghost" className="text-[#0C4B93]">About</Button></a>
            <a href="#features"><Button variant="ghost" className="text-[#0C4B93]">Feautures</Button></a>
            <a href="#how-it-works"><Button variant="ghost" className="text-[#0C4B93]">How It Works</Button></a>
            <Link to="/signup"><Button className="bg-[#0C4B93] hover:bg-[#064283] text-white">SignUp</Button></Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className={`relative bg-gradient-to-b from-[#E5EFF9] to-background py-16 md:py-24 px-4 transition-all duration-700 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left Content */}
            <div className="w-full lg:w-1/2 space-y-6">
<Badge variant="outline" className="bg-[#D7E9F7] text-[#0C4B93] border-none px-4 py-2">
  <img src="/mu-logo.png" alt="Mogadishu University Logo" className="w-5 h-5 mr-2" />
  Mogadishu University
</Badge>


              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0C4B93] leading-tight">
                Learn anything by <span className="text-[#106CC8]">teaching</span> what you know
              </h1>

              <p className="text-lg text-gray-700 max-w-xl">
                SkillXchange connects university students with peers for mutual skill exchange. Teach what you're good at, learn what you
                want to know - all for free.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                <Button size="lg" className="bg-[#0C4B93] hover:bg-[#064283] text-white">
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>

                <Link to="/login">
                  <Button variant="outline" size="lg">
                    I have an Account
                  </Button>
                </Link>
                
              </div>


            </div>

            {/* Right Image/Illustration */}
            <div className="w-full lg:w-1/2 relative">
              <div className="relative h-[400px] md:h-[500px]">
                {/* Decorative elements */}
                <div className="absolute w-full h-full">
                  <div className="absolute w-64 h-64 bg-[#D7E9F7] rounded-full -top-10 -right-10 opacity-50"></div>
                  <div className="absolute w-32 h-32 bg-[#E5EFF9] rounded-full bottom-20 left-10 opacity-50"></div>
                </div>

                {/* Main illustration */}
                <div className="relative h-full flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                    alt="Students collaborating"
                    className="rounded-lg shadow-2xl object-cover h-[80%] w-[80%] z-10"
                  />
                  
                  <div className="absolute -right-4 top-20 bg-white p-3 rounded-lg shadow-lg transform rotate-3 transition-all duration-500 hover:scale-105 z-20">
                    <div className="bg-[#D7E9F7] p-2 rounded-md flex items-center gap-2">
                      <span className="text-2xl">🎓</span>
                      <span className="font-medium text-sm">Teaching</span>
                    </div>
                  </div>
                  
                  <div className="absolute -left-4 bottom-20 bg-white p-3 rounded-lg shadow-lg transform -rotate-3 transition-all duration-500 hover:scale-105 z-20">
                    <div className="bg-[#E5EFF9] p-2 rounded-md flex items-center gap-2">
                      <span className="text-2xl">💡</span>
                      <span className="font-medium text-sm">Learning</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Results Section */}
      {/* <section className="py-16 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <Badge className="mb-4 bg-[#E5EFF9] text-[#0C4B93] hover:bg-[#E5EFF9]">Research Outcomes</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0C4B93]">Case Study Results</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-4">
              Our university research demonstrates the effectiveness of peer-to-peer skill exchange
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="text-4xl font-bold text-[#106CC8] mb-2">87%</div>
              <p className="text-gray-600">of participants reported improved practical skills</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="text-4xl font-bold text-[#106CC8] mb-2">92%</div>
              <p className="text-gray-600">found teaching others reinforced their own knowledge</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="text-4xl font-bold text-[#106CC8] mb-2">4.8/5</div>
              <p className="text-gray-600">average satisfaction rating among participants</p>
            </div>
          </div>
        </div>
      </section> */}

      {/* Features Section */}
      <section className="py-20 px-4 bg-white" id="features">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-[#D7E9F7] text-[#0C4B93] hover:bg-[#D7E9F7]">Platform Features</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0C4B93]">Why Choose SkillXchange?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-4">
              Our research-backed platform makes skill exchange simple, effective, and enjoyable for students
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <Card key={idx} className="overflow-hidden transition-all duration-300 hover:shadow-xl border-none">
                <CardHeader className={`${feature.color} p-6 flex justify-center`}>
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-md">
                    <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
                  </div>
                </CardHeader>
                
                <CardContent className="p-6 flex-grow">
                  <CardTitle className="text-xl font-bold text-[#0C4B93] mb-3">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-600">{feature.desc}</CardDescription>
                </CardContent>
                
                <CardFooter className="px-6 pb-6">
                  <Button variant="ghost" className="text-[#0C4B93] hover:bg-[#E5EFF9] w-full justify-between">
                    Research data
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section className="py-20 px-4 bg-[#E5EFF9]" id="how-it-works">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-[#D7E9F7] text-[#0C4B93] hover:bg-[#D7E9F7]">Research Methodology</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0C4B93]">How SkillXchange Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-4">
              Our academic approach to peer-to-peer learning
            </p>
          </div>

          <div className="relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-[#D7E9F7] -translate-y-1/2 z-0"></div>

            <div className="grid md:grid-cols-3 gap-8 relative z-10">
              {/* Step 1 */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg mb-6 border-4 border-[#D7E9F7]">
                  <span className="text-2xl font-bold text-[#0C4B93]">1</span>
                </div>

                <Card className="w-full text-center border-none h-full">
                  <CardContent className="p-6">
                    <CardTitle className="text-xl font-bold text-[#0C4B93] mb-3">Create Your Profile</CardTitle>
                    <CardDescription>
                      Sign up and list the skills you can teach and those you want to learn. Add your availability and research interests.
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg mb-6 border-4 border-[#D7E9F7]">
                  <span className="text-2xl font-bold text-[#0C4B93]">2</span>
                </div>

                <Card className="w-full text-center border-none h-full">
                  <CardContent className="p-6">
                    <CardTitle className="text-xl font-bold text-[#0C4B93] mb-3">Get Matched</CardTitle>
                    <CardDescription>
                      Our algorithm finds your ideal skill-exchanging partners based on complementary skills and academic interests.
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg mb-6 border-4 border-[#D7E9F7]">
                  <span className="text-2xl font-bold text-[#0C4B93]">3</span>
                </div>

                <Card className="w-full text-center border-none h-full">
                  <CardContent className="p-6">
                    <CardTitle className="text-xl font-bold text-[#0C4B93] mb-3">Learn & Teach</CardTitle>
                    <CardDescription>
                      Connect with your matches, schedule sessions, and start exchanging knowledge while documenting outcomes.
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Button size="lg" className="bg-[#0C4B93] hover:bg-[#064283] text-white">
              View Full Methodology
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-[#D7E9F7] text-[#0C4B93] hover:bg-[#D7E9F7]">Student Feedback</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0C4B93]">What Participants Say</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-4">
              Testimonials from university students who participated in our research
            </p>
          </div>

          <div className="relative overflow-hidden">
            <div
              className="flex transition-all duration-500"
              style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}
            >
              {testimonials.map((testimonial, idx) => (
                <div key={idx} className="min-w-full px-4">
                  <Card className="max-w-3xl mx-auto border-none shadow-lg">
                    <CardContent className="p-8">
                      <div className="flex flex-col md:flex-row gap-6 items-center">
                        <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 border-4 border-[#D7E9F7]">
                          <AspectRatio ratio={1/1}>
                            <img
                              src={testimonial.avatar}
                              alt={testimonial.name}
                              className="w-full h-full object-cover"
                            />
                          </AspectRatio>
                        </div>

                        <div className="flex-grow">
                          <div className="flex mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-5 h-5 ${i < testimonial.stars ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                              />
                            ))}
                          </div>

                          <p className="text-gray-600 italic mb-4">"{testimonial.quote}"</p>

                          <div>
                            <h4 className="font-bold text-[#0C4B93]">{testimonial.name}</h4>
                            <p className="text-sm text-gray-500">{testimonial.role}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            {/* Testimonial navigation dots */}
            <div className="flex justify-center mt-8 gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTestimonial(idx)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    activeTestimonial === idx ? "bg-[#0C4B93] w-6" : "bg-gray-300"
                  }`}
                  aria-label={`View testimonial ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Research Findings Section */}
      <section className="py-20 px-4 bg-[#E5EFF9]" id="about">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-[#D7E9F7] text-[#0C4B93] hover:bg-[#D7E9F7]">Case Study</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0C4B93] mb-6">About Our Research</h2>

              <p className="text-lg text-gray-700 mb-6">
                SkillXchange was developed as a final year research project at Mogadishu University. Our hypothesis was that peer-to-peer learning could significantly enhance skill acquisition among university students.
              </p>

              <p className="text-lg text-gray-700 mb-8">
                Through extensive user testing and data analysis, we've demonstrated that collaborative skill exchange leads to better learning outcomes and higher student engagement compared to traditional learning methods.
              </p>

              <Button variant="outline" size="lg">
                Read Research Paper
                <ArrowUpRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            <div className="relative">
              <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80" 
                  alt="Research Team" 
                  className="w-full h-full object-cover"
                />
                {/* Decorative elements */}
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#D7E9F7] rounded-2xl -z-10"></div>
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#E5EFF9] rounded-2xl -z-10"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-[#0C4B93] text-white">
        <div className="container mx-auto max-w-5xl text-center">
          <Badge className="mb-6 bg-white/20 text-white hover:bg-white/30"></Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Skill-Exchanging Journey?</h2>

          <p className="text-lg text-gray-200 mb-10 max-w-2xl mx-auto">
            Join our community today and discover the joy of learning through teaching. It's completely free and only
            takes a minute to get started.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" variant="secondary" className="bg-white text-[#0C4B93] hover:bg-gray-100">
              Create Your Account
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            </Link>



          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default HomePage;
