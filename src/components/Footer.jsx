const Footer = () => {
    return (
      <footer className="bg-white text-sm text-gray-500 border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <span>&copy; {new Date().getFullYear()} SmartSpend. All rights reserved.</span>
          <span className="text-blue-500 font-medium">Built by Aayush 🚀</span>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  