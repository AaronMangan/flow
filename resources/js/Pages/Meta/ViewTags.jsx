import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useRef, useState, useEffect } from 'react';
import FormGen from '@/Components/FormGenerator/FormGen';
import FloatingButton from '@/Components/FloatingButton';
import Modal from '@/Components/Modal';
import { toast } from 'react-toastify';
import axios from 'axios';
import { router } from '@inertiajs/react'
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

export default function ViewTags({ tags }) {
  const [showCreateTag, setShowCreateTag] = useState(false);
  /**
   * Construct a form object.
   */
  const { data, setData, post, processing, reset, errors, clearErrors } = useForm({ name: '', code: '', description: '' });
  const [activeTag, setActiveTag] = useState({ data });

  const formObj = {
    id: 'tag_form',
    title: activeTag && activeTag?.id > 0 ? 'Edit ' + activeTag?.name : 'Add New Tag',
    titleClass: 'text-gray-600 text-xl',
    contents: [
      {
        id: 'name',
        type: 'text',
        label: 'Name',
        placeholder: 'Please enter a name',
        className: 'w-full',
        parentClassName: 'col-span-2 pr-2 w-full',
      }
    ],
    buttons: [
      {
        id: 'close_button',
        label: 'Close',
        onClick: () => {
          closeModal();
        },
        type: 'danger'
      },
      {
        id: 'save_button',
        label: 'Save',
        onClick: (e) => postTag(),
        type: 'primary'
      },
    ],
  };

  /**
   * Update the form data with the data from the form generator
   * @param {object} values 
   */
  const updateFormData = (values) => {
    setData(null);
    setData(values);
  }

  /**
   * Close Modal
   */
  const closeModal = () => {
    setActiveTag(null);
    setActiveTag({ name: '', code: '', description: '' })
    setShowCreateTag(false);
  }

  /**
   * Reloads the data without reloading the page.
   */
  const refreshData = () => {
    router.visit(route('tags'), {
      only: ['tags'],
    })
  }

  /**
   * Save the tag
   * @param {*} e 
   */
  const postTag = (e) => {
    // e.preventDefault();
    if(activeTag?.id) {
        post(route('tag.update', {tag: activeTag}), {
            onSuccess: () => {
                toast.success('Tag updated successfully');
                setShowCreateTag(false);
                setActiveTag(null);
                refreshData();
            },
            onError: () => {
                toast.error('An error occurred, please contact your administrator');
            },
        });
    } else {
      post(route('tag.create'), {
        onSuccess: () => {
          toast.success('Tag created successfully!');
          setActiveTag(null);
          setShowCreateTag(false);
          refreshData();
        },
        onError: () => {
            toast.error('An error occurred, please contact your administrator for assistance');
        }
      })
    }
  }

  const deleteTag = (id) => {
    axios.delete(route('tag.destroy', {tag: id})).then((response) => {
        if(response?.status == 200) {
            toast.success('Tag deleted successfully');
            reset();
            refreshData();
        } else {
            toast.error('Unable to delete the tag. Please check you have access or contact your administrator');
        }
    })
  }

  return (
    <AuthenticatedLayout>
    <Head title="Tags" />
      <>
        <div className="py-12">
          <div className="w-full mx-auto sm:px-6 lg:px-8">
            <div className="overflow-hidden sm:rounded-lg dark:bg-gray-800">
              {(!tags || tags.length <= 0) && (
                <>
                  <ExclamationCircleIcon className="w-16 h-16 mx-auto text-center text-gray-500" />
                  <div className='text-3xl text-center text-gray-500'>No Tags</div>
                  <div className='text-xs text-center text-gray-500'>Click the button below to add some tags</div>
                </>
              )}
              {tags && tags.map((tag) => {
                return (
                  <span
                    className="inline-flex items-center px-3 py-1 mr-2 text-sm font-medium text-white transition-colors bg-blue-500 rounded-full hover:bg-blue-600"
                    onClick={(e) => {
                      setActiveTag(null);
                      setActiveTag(tag);
                      setShowCreateTag(true);
                    }}
                  >
                    {tag.name}
                  </span>
                )
              })}
            </div>
          </div>
        </div>

        {/* Lets users add a new setting */}
        <FloatingButton className="bg-gray-800" onClick={
            () => {setShowCreateTag(true)}
        }/>
      </>

      {/* Create a new setting modal */}
      <Modal show={showCreateTag} onClose={closeModal}>
        <FormGen
          config={formObj}
          className='grid grid-cols-2 gap-1 px-4 py-2 dark:bg-gray-800 dark:text-gray-200'
          valuesCallback={updateFormData}
          values={activeTag}
          errors={errors}
          reset={reset}
        />
      </Modal>
    </AuthenticatedLayout>
  );
}