
import React from 'react';

const About: React.FC = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl">
            About ADIT
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Free Music for Creators
          </p>
        </div>

        <div className="mt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-gray-400 text-lg mb-6">
                At ADIT, our mission is to provide content creators, filmmakers, and developers with a curated library of high-quality, royalty-free music. We believe that great music should be accessible to everyone, regardless of their budget.
              </p>
              <p className="text-gray-400 text-lg">
                We are passionate about music and creativity. We started this project to solve a problem we faced ourselves: finding great music for our projects without having to worry about complicated licensing and expensive fees.
              </p>
            </div>
            <div className="flex items-center justify-center">
              <img
                className="rounded-lg shadow-2xl"
                src="pics/pexels-pixabay-257904.jpg"
                alt="Man listening to music"
              />
            </div>
          </div>
        </div>

        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-10">
            Meet the Team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="text-center">
              <img
                className="mx-auto h-40 w-40 rounded-full shadow-lg"
                src="pics/istockphoto-1471448614-1024x1024.jpg"
                alt="Team member"
              />
              <h3 className="mt-6 text-xl font-medium">Dev Khandelwal</h3>
              <p className="text-gray-400">Founder & CEO</p>
            </div>
            <div className="text-center">
              <img
                className="mx-auto h-40 w-40 rounded-full shadow-lg"
                src="pics/istockphoto-1471448614-1024x1024.jpg"
                alt="Team member"
              />
              <h3 className="mt-6 text-xl font-medium">Jane Smith</h3>
              <p className="text-gray-400">Lead Music Curator</p>
            </div>
            <div className="text-center">
              <img
                className="mx-auto h-40 w-40 rounded-full shadow-lg"
                src="pics/istockphoto-1471448614-1024x1024.jpg"
                alt="Team member"
              />
              <h3 className="mt-6 text-xl font-medium">Mike Johnson</h3>
              <p className="text-gray-400">Head of Engineering</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
