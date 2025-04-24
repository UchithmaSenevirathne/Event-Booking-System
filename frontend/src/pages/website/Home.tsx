import React from "react";
import homeBg from "../../assets/home-bg.jpg";
import h1 from "../../assets/h1.jpg";
import h2 from "../../assets/h2.jpg";
import h3 from "../../assets/h3.jpg";
import h4 from "../../assets/h4.jpg";
import { Button } from "antd";

// export default function Home() {
//   return (
//     <div
//       className="relative w-full h-screen bg-center bg-cover"
//       style={{ backgroundImage: `url(${homeBg})` }}
//     >
//       {/* Dark overlay */}
//       <div className="absolute inset-0 bg-black bg-opacity-50"></div>

//       <div className="relative z-10 flex items-center justify-center h-full px-16 py-10">
//         {/* Left text */}
//         <div className="flex flex-col w-1/2 gap-10 pr-8">
//           <h4 className="text-3xl font-bold leading-tight text-white">Best Event Booking Platform</h4>
//           <h1 className="font-bold leading-tight text-white text-7xl">
//             The Ultimate <span className="text-[#1677ff]">Event Booking</span>{" "}
//             Experience
//           </h1>
//           <div className="flex gap-4">
//             <Button type="primary" size="large">
//               Book Now
//             </Button>
//             <Button type="default" size="large">
//               Sign In
//             </Button>
//           </div>
//         </div>

//         {/* Right image grid */}
//         <div className="flex flex-col gap-4 w-1/2 max-w-[600px]">
//           <div className="flex gap-4">
//             <img
//               src={h1}
//               className="object-cover w-1/2 h-auto shadow-lg rounded-xl"
//               alt="h1"
//             />
//             <img
//               src={h2}
//               className="object-cover w-1/2 h-auto shadow-lg rounded-xl"
//               alt="h2"
//             />
//           </div>

//           <div className="flex gap-4">
//             <img
//               src={h3}
//               className="object-cover w-2/3 h-auto shadow-lg rounded-xl"
//               alt="h3"
//             />
//             <img
//               src={h4}
//               className="object-cover w-1/3 shadow-lg h-52 rounded-xl"
//               alt="h4"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

export default function Home() {
  return (
    <div
      className="relative w-full h-screen bg-center bg-cover"
      style={{ backgroundImage: `url(${homeBg})` }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 py-10 md:flex-row md:px-16">
        {/* Left: Title + Buttons */}
        <div className="flex flex-col w-full gap-6 text-center md:w-1/2 md:gap-10 md:text-left">
          <h4 className="text-xl font-bold text-white lg:text-3xl md:text-2xl">
            Best Event Booking Platform
          </h4>
          <h1 className="text-4xl font-bold leading-tight text-white lg:text-7xl md:text-6xl">
            The Ultimate <span className="text-[#1677ff]">Event Booking</span> Experience
          </h1>
          <div className="flex justify-center gap-4 md:justify-start">
            <Button type="primary" size="large">
              Book Now
            </Button>
            <Button type="default" size="large">
              Sign In
            </Button>
          </div>
        </div>

        {/* Right: Image Grid */}
        <div className="flex flex-col gap-4 w-full md:w-1/2 max-w-[600px] mt-10 md:mt-0">
          {/* First Row */}
          <div className="flex gap-4">
            <img src={h1} className="object-cover w-1/2 h-auto shadow-lg sm:w-full md:w-1/2 rounded-xl" alt="h1" />
            <img src={h2} className="object-cover w-1/2 h-auto shadow-lg sm:w-full md:w-1/2 rounded-xl" alt="h2" />
          </div>

          {/* Second Row */}
          <div className="flex gap-4">
            <img src={h3} className="object-cover w-2/3 h-auto shadow-lg sm:w-full md:w-2/3 rounded-xl" alt="h3" />
            <img src={h4} className="object-cover w-1/3 shadow-lg sm:w-full md:w-1/3 h-52 rounded-xl" alt="h4" />
          </div>
        </div>
      </div>
    </div>
  );
}
