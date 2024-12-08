import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import InputLabel from '@/Components/InputLabel';
import { toast } from 'react-toastify';
import Select from 'react-select';
import InputError from '@/Components/InputError';

export default function UserCreateOrEdit({auth, statuses}) {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
  };
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    status_id: 1,
    organisation_id: auth.organisation_id
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      const response = await axios.post(route('users.create'), formData);

      if (response.status === 200) {
        toast.success('User created successfully');
        setFormData({
          name: '',
          email: '',
          password: '',
          password_confirmation: '',
        });
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      }
    }
  };
    
  // Run this logic when 'mounted'
  useEffect(() => {
    // 
  }, []);
  
  return (
    <AuthenticatedLayout>
      <Head title="User" />
      <>
        <div className="py-12">
          <div className="w-1/2 mx-auto max-w-100 sm:px-6 lg:px-8">
            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
              <div className="p-6 text-gray-900 dark:text-gray-100">
                <h2 className="text-2xl font-bold text-center">New User</h2>
                {/* Create New User Form */}
                <form onSubmit={handleSubmit}>
                  {/* Name */}
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name[0]}</p>}
                  </div>

                  {/* Email */}
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email[0]}</p>}
                  </div>

                  {/* Password */}
                  <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password[0]}</p>}
                  </div>

                  {/* Confirm Password */}
                  <div className="mb-6">
                    <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                    <input
                      type="password"
                      name="password_confirmation"
                      id="password_confirmation"
                      value={formData.password_confirmation}
                      onChange={handleChange}
                      className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {errors.password_confirmation && <p className="mt-1 text-xs text-red-500">{errors.password_confirmation[0]}</p>}
                  </div>

                  {/* Confirm Password */}
                  <div className="mb-6">
                    <InputLabel
                      htmlFor="status"
                      value="Status"
                      className=""
                    />
                    <Select
                      id='status_id'
                      name='status_id'
                      options={statuses}
                      onChange={(e) => {
                        setFormData({...formData, status_id: e.value})
                      }}
                      placeholder='Please select a status'
                      menuPlacement='top'
                      value={statuses.find(x => x.value == formData.status_id)}
                      className='border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600'
                    />
                    {errors && errors.status_id && <InputError
                      message={errors.status_id}
                      className="mt-2"
                    />}
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full px-4 py-2 text-white bg-slate-800 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {loading ? 'Submitting...' : 'Create'}
                    </button>
                  </div>
                </form>

                {/* Bottom text */}
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    The new user will receive an email with a link to set their password
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </AuthenticatedLayout>
);
}