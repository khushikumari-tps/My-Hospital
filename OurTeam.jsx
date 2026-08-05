import React, { useState } from 'react';

const teamMembers = [
  {
    id: 1,
    name: 'Dr. Deeksha Kapoor',
    title: 'Senior Consultant',
    department: 'Surgical Oncology',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    bio: 'Dr. Deeksha Kapoor is a renowned Surgical Oncologist with over 15 years of experience. She specializes in minimally invasive procedures and has completed fellowships at premier international institutes.',
    qualifications: 'MBBS, MS (General Surgery), MCh (Surgical Oncology)',
    fellowships: ['Fellowship in Advanced Laparoscopic Surgery', 'Fellowship in GI Oncology']
  },
  {
    id: 2,
    name: 'Dr. Shyamal Kumar Sen',
    title: 'Head of Department',
    department: 'Internal Medicine',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    bio: 'Dr. Sen brings 20 years of expertise in managing complex internal medicine cases. He is passionate about preventive healthcare and chronic disease management.',
    qualifications: 'MBBS, MD (Internal Medicine)',
    fellowships: ['Fellowship in Critical Care Medicine']
  },
  {
    id: 3,
    name: 'Dr. Sachin Kumar',
    title: 'Consultant',
    department: 'Gastroenterology',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    bio: 'Dr. Sachin Kumar is a specialist in pancreato-biliary diseases. He is dedicated to providing state-of-the-art diagnostic and therapeutic endoscopic procedures.',
    qualifications: 'MBBS, MD, DM (Gastroenterology)',
    fellowships: ['Advanced Endoscopy Fellowship']
  },
  {
    id: 4,
    name: 'Ms. Poonam Sharma',
    title: 'Lead Coordinator',
    department: 'Patient Support',
    image: 'https://images.unsplash.com/photo-1594824436998-038e121da0c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    bio: 'Poonam Sharma leads our patient support initiatives, ensuring that every patient receives compassionate care, seamless scheduling, and continuous guidance throughout their treatment journey.',
    qualifications: 'BSc Nursing, MHA (Hospital Administration)',
    fellowships: []
  }
];

const departments = ['All', 'Surgical Oncology', 'Internal Medicine', 'Gastroenterology', 'Patient Support'];

export default function OurTeam() {
  const [activeTab, setActiveTab] = useState('All');
  const [selectedMember, setSelectedMember] = useState(null);

  const filteredMembers = activeTab === 'All' 
    ? teamMembers 
    : teamMembers.filter(member => member.department === activeTab);

  return (
    <section className="py-24 bg-stone-50 font-sans text-stone-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-stone-900 mb-6">
            Meet Our <span className="text-emerald-700">Expert Team</span>
          </h2>
          <p className="text-lg text-stone-600 leading-relaxed">
            Our multidisciplinary team of specialists is dedicated to providing world-class, compassionate healthcare tailored to your unique needs.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setActiveTab(dept)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border ${
                activeTab === dept
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-md'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-emerald-700 hover:text-emerald-700'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredMembers.map((member) => (
            <div 
              key={member.id} 
              className="group relative bg-white rounded-3xl overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-stone-100 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)]"
            >
              <div className="aspect-[3/4] overflow-hidden relative">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-emerald-800 shadow-sm">
                  {member.department}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-stone-900 mb-1">{member.name}</h3>
                <p className="text-sm font-medium text-emerald-700 mb-5">{member.title}</p>
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => setSelectedMember(member)}
                    className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors"
                  >
                    View Bio
                  </button>
                  <button className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 shadow-md hover:shadow-lg transition-all">
                    Book Appointment
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Slide-Over / Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedMember(null)}
          ></div>
          
          {/* Drawer */}
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in-right overflow-y-auto">
            <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50 sticky top-0 z-10">
              <h3 className="text-xl font-bold text-stone-900">Doctor Profile</h3>
              <button 
                onClick={() => setSelectedMember(null)}
                className="p-2 text-stone-400 hover:text-stone-700 transition-colors rounded-full hover:bg-stone-200"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-8">
              <div className="aspect-square rounded-2xl overflow-hidden mb-6 shadow-md">
                <img src={selectedMember.image} alt={selectedMember.name} className="w-full h-full object-cover" />
              </div>
              <h2 className="text-3xl font-extrabold text-stone-900 mb-2">{selectedMember.name}</h2>
              <p className="text-lg font-semibold text-emerald-700 mb-1">{selectedMember.title}</p>
              <p className="text-sm text-stone-500 font-medium mb-8 uppercase tracking-wider">{selectedMember.department}</p>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-stone-900 mb-2 uppercase tracking-wide">About</h4>
                  <p className="text-stone-600 leading-relaxed">{selectedMember.bio}</p>
                </div>
                
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
                  <h4 className="text-sm font-bold text-stone-900 mb-2 uppercase tracking-wide">Qualifications</h4>
                  <p className="text-stone-700 font-medium">{selectedMember.qualifications}</p>
                </div>

                {selectedMember.fellowships.length > 0 && (
                  <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
                    <h4 className="text-sm font-bold text-stone-900 mb-2 uppercase tracking-wide">Fellowships</h4>
                    <ul className="list-disc list-inside text-stone-700 space-y-1">
                      {selectedMember.fellowships.map((fellowship, idx) => (
                        <li key={idx}>{fellowship}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-6 border-t border-stone-100 bg-white mt-auto sticky bottom-0">
              <button className="w-full py-4 rounded-xl text-base font-bold text-white bg-emerald-700 hover:bg-emerald-800 shadow-lg hover:shadow-xl transition-all">
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Basic keyframes for slide-in animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />
    </section>
  );
}
