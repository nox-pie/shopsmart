import { User, Package, Settings, LogOut } from 'lucide-react';

const Profile = () => {
  return (
    <div className="min-h-screen pt-32 pb-24 px-6 max-w-6xl mx-auto flex flex-col md:flex-row gap-12">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 flex-shrink-0 animate-fade-up">
        <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100 sticky top-32">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-14 h-14 bg-prime text-white rounded-full flex items-center justify-center text-xl font-bold">
              JD
            </div>
            <div>
              <h2 className="font-bold text-prime text-lg">Jane Doe</h2>
              <p className="text-sm text-slate-500">jane.doe@example.com</p>
            </div>
          </div>

          <nav className="space-y-2">
            {[
              { icon: User, label: 'Personal Info', active: true },
              { icon: Package, label: 'Order History', active: false },
              { icon: Settings, label: 'Preferences', active: false },
            ].map((item, i) => (
              <button
                key={i}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors font-medium ${item.active ? 'bg-white text-prime shadow-sm border border-slate-200' : 'text-slate-500 hover:bg-slate-100 hover:text-prime'}`}
              >
                <item.icon
                  size={18}
                  className={item.active ? 'text-accent' : ''}
                />
                <span>{item.label}</span>
              </button>
            ))}

            <div className="pt-6 mt-6 border-t border-slate-200">
              <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors font-medium text-rose-500 hover:bg-rose-50">
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow animate-fade-up animate-delay-100">
        <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-100 shadow-sm">
          <h1 className="text-3xl font-display font-bold text-prime mb-8">
            Personal Information
          </h1>

          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <div className="space-y-2">
              <label className="text-sm font-bold text-prime uppercase tracking-wider">
                First Name
              </label>
              <input
                type="text"
                defaultValue="Jane"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-prime uppercase tracking-wider">
                Last Name
              </label>
              <input
                type="text"
                defaultValue="Doe"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-prime uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                defaultValue="jane.doe@example.com"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
              />
            </div>
          </div>

          <h2 className="text-xl font-display font-bold text-prime mb-6 mt-12 border-t border-slate-100 pt-10">
            Shipping Details
          </h2>
          <div className="grid gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-prime uppercase tracking-wider">
                Street Address
              </label>
              <input
                type="text"
                defaultValue="123 Signature Avenue"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
              />
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-2 md:col-span-1">
                <label className="text-sm font-bold text-prime uppercase tracking-wider">
                  City
                </label>
                <input
                  type="text"
                  defaultValue="New York"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                />
              </div>
              <div className="space-y-2 md:col-span-1">
                <label className="text-sm font-bold text-prime uppercase tracking-wider">
                  State
                </label>
                <input
                  type="text"
                  defaultValue="NY"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                />
              </div>
              <div className="space-y-2 md:col-span-1">
                <label className="text-sm font-bold text-prime uppercase tracking-wider">
                  Zip Code
                </label>
                <input
                  type="text"
                  defaultValue="10001"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          <div className="mt-12 flex justify-end">
            <button className="px-8 py-4 bg-prime text-white rounded-full font-bold shadow-md hover:bg-slate-800 hover:-translate-y-1 transition-all duration-300">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
