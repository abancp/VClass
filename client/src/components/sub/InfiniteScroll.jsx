import { motion } from "framer-motion";
import ClassCard from "./ClassCard";

const images = ['back.png', 'back1.png', 'back2.png', 'back3.png', 'back4.png', 'back5.png', 'back6.png', 'back7.png', 'back8.png', 'back9.png', 'back10.png', 'back11.png']
const subjects = ['App Development', 'Web Technology', 'Electronics', 'Object Oriented Programming', 'Chemistry', 'Mathematics', 'Physics', 'CSIKS', 'CCN']

const InfiniteScroll = () => {
  return (
    <div className="w-screen overflow-hidden">
      <motion.div
        className="flex w-max bg-dark gap-4 "
        animate={{ x: ["0%", "-100%"] }}
        transition={{ ease: "linear", duration: 50, repeat: Infinity }}
      >
        {images.concat(images).map((src, i) => (
          <ClassCard
            forHome={true}
            bg_url={src}
            name="CTS4"
            subject={subjects[Math.floor(Math.random() * subjects.length)]}
            number_of_students={Math.floor(Math.random() * (600 - 100 + 1)) + 100} />
        ))}
      </motion.div>
    </div>
  );
};

export default InfiniteScroll;

