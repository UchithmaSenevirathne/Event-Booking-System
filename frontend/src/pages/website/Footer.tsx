import { Layout } from "antd";

const { Footer: AntFooter } = Layout;

const Footer = () => {
  return (
    <AntFooter className="p-6 mt-10 text-white bg-gradient-to-r from-[#1677ff] via-[#8248FF] to-[#6937CA]">
      <div className="flex flex-col items-center justify-between mx-auto max-w-7xl md:flex-row">
        <div className="mb-4 text-center md:text-left md:mb-0">
          <p className="text-sm">&copy; {new Date().getFullYear()} Uchithma Senevirathne. All rights reserved.</p>
        </div>
        <div className="flex space-x-6">
          <a href="#" className="text-sm text-white transition-colors duration-200">
            Privacy Policy
          </a>
          <a href="#" className="text-sm text-white transition-colors duration-200">
            Terms of Service
          </a>
          <a href="#" className="text-sm text-white transition-colors duration-200 ">
            Contact
          </a>
        </div>
      </div>
    </AntFooter>
  );
};

export default Footer;
