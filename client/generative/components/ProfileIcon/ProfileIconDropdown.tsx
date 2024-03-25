import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  FiEdit,
  FiChevronDown,
  FiTrash,
  FiShare,
  FiPlusSquare,
  FiMessageSquare,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { PiPaperPlaneTilt } from "react-icons/pi";
// import io from 'socket.io-client';

// const ProfileIconDropDown = ({ user_data }) => {

//   useEffect(() => {
//     // const socket = io('http://localhost:8000');

//     socket.on('connect_error', (error) => {
//       console.error("Error connecting to Socket.io server:", error);
//     });
    

//     socket.emit('chat message', 'Hello from client!');


//     return () => {
    
//       socket.disconnect();
//     };
//   }, []);


  const [open, setOpen] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const dropdownRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
        modalRef.current && !modalRef.current.contains(event.target)) {
        setOpen(false);
        setShowChatModal(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // Sample collaborators data
  const collaborators = ['Collaborator 1'];

  // Function to handle opening chat modal
  const handleChatClick = (collaborator) => {
    setShowChatModal(true);
  };

  return (
    <>
      <motion.div animate={open ? "open" : "closed"} className="relative" ref={dropdownRef}>
        <button onClick={() => setOpen((pv) => !pv)}>
          {user_data.profileImageUrl && (
            <Image
              src={user_data.profileImageUrl}
              alt="Profile"
              width={30}
              height={30}
              className="w-7 h-7 mr-2 rounded-full"
              title={user_data.email}
            />
          )}
        </button>

        <motion.ul
          initial={wrapperVariants.closed}
          variants={wrapperVariants}
          style={{ originY: "top", translateX: "-50%", maxHeight: "auto" }}
          className="flex flex-col gap-2 p-2 rounded-lg bg-gray-800 text-white shadow-xl absolute top-[120%] left-[50%] w-60 overflow-hidden"
        >
          {/* Render email option first */}
          <Option setOpen={setOpen} Icon={FiEdit} text={user_data.email} />

          {/* Render Collaborators list below email option */}
          <li className="flex flex-col gap-1">
            <span className="font-sans text-lg text-center">Collaborators</span>
            <div className="overflow-y-auto max-h-full">
              {collaborators.length === 0 ? (
                <span className="text-xs">Empty</span>
              ) : (
                collaborators.map((collaborator, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <span>{collaborator}</span>
                    <button className="text-indigo-500 flex items-center gap-1" onClick={() => handleChatClick(collaborator)}>
                      <span className='text-sm font-semibold'>chat</span>
                      <FiMessageSquare size={15} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </li>

          {/* Render other options */}
          <Option setOpen={setOpen} Icon={FiPlusSquare} text="Add Collaborator" />
          <Option setOpen={setOpen} Icon={FiEdit} text="Edit History" />
          <Option setOpen={setOpen} Icon={FiTrash} text="Logout" />
        </motion.ul>
      </motion.div>

      {/* Modal for chat */}
      {showChatModal && (
        <div ref={modalRef} className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50" onClick={() => setShowChatModal(false)}>
          <div className="bg-white p-4 rounded-md shadow-md absolute right-10 top-1/2 transform -translate-y-1/2 h-4/5 w-96 flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className='flex items-center bg-slate-800 w-full h-10 rounded-t-md'>
              <span className='w-8 h-8 mt-1 ml-2 bg-gray-500 rounded-full'></span>
              <h2 className='text-white ml-2 font-bold py-2'>Collaborator Name</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              {/* Chat messages */}
            </div>
            <div className="flex justify-around gap-3 items-center bg-white rounded-b-md">
              <input type="text" placeholder="Type your message..." className=" p-2 rounded-l-md border" />
              <PiPaperPlaneTilt size={20} color='black' />
            </div>
            <button onClick={() => setShowChatModal(false)}>Close</button>
          </div>
        </div>
      )}

    </>
  );
};

const Option = ({ text, Icon, setOpen }) => {
  return (
    <motion.li
      variants={itemVariants}
      onClick={() => setOpen(false)}
      className="flex items-center gap-2 w-full p-2 text-xs font-medium whitespace-nowrap rounded-md hover:bg-indigo-100 text-slate-200 hover:text-indigo-500 transition-colors cursor-pointer"
    >
      <motion.span variants={actionIconVariants}>
        <Icon />
      </motion.span>
      <span>{text}</span>
    </motion.li>
  );
};

export default ProfileIconDropDown;

const wrapperVariants = {
  open: {
    scaleY: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  closed: {
    scaleY: 0,
    transition: {
      when: "afterChildren",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  open: {
    opacity: 1,
    y: 0,
    transition: {
      when: "beforeChildren",
    },
  },
  closed: {
    opacity: 0,
    y: -15,
    transition: {
      when: "afterChildren",
    },
  },
}

const actionIconVariants = {
  open: { scale: 1, y: 0 },
  closed: { scale: 0, y: -7 },
};
