// "use client";
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { toast } from "@/hooks/use-toast";
// import { API_URL } from "@/constants";

// const authApi = axios.create({
//   baseURL: `${API_URL}`,
//   withCredentials: true,
// });

// const inputStyles =
//   "bg-white/90 border-[#472014] focus:border-[#c1502e] focus:ring-[#c1502e] text-black";
// const buttonStyles =
//   "bg-[#c1502e] hover:bg-[#472014] text-white font-bold transition-all duration-300";
// const labelStyles = "text-[#472014] font-semibold";

// const EditProfileForm = () => {
//   const [userData, setUserData] = useState({
//     fullName: "",
//     email: "",
//     phoneNumber: "",
//     location: "",
//     role: "",
//     // Student-specific fields
//     university: "",
//     course: "",
//     // Professor-specific fields
//     title: "",
//     department: "",
//     researchInterests: "",
//     // Business-specific fields
//     companyName: "",
//     industry: "",
//     description: "",
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [successMessage, setSuccessMessage] = useState("");

//   useEffect(() => {
//     fetchUserData();
//   }, []);

//   const fetchUserData = async () => {
//     try {
//       const response = await authApi.get("/user/profile");
//       setUserData(response.data);
//       setLoading(false);
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     } catch {
//       setError("Failed to fetch user data");
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setUserData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setError(null);
//     try {
//       setSuccessMessage("Profile updated successfully!");
//       toast({
//         title: "Profile updated",
//         description: "Your profile has been successfully updated.",
//         duration: 5000,
//       });
//     } catch {
//       setError("Failed to update profile. Please try again.");
//     }
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <Card className="w-full max-w-2xl mx-auto bg-white/95 shadow-xl border-0">
//       <CardHeader className="bg-gradient-to-r from-[#c1502e] to-[#686256] text-white rounded-t-lg">
//         <CardTitle className="text-2xl font-caveat font-bold text-center">
//           Edit Your Profile
//         </CardTitle>
//       </CardHeader>
//       <CardContent className="p-6">
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="space-y-2">
//             <Label htmlFor="fullName" className={labelStyles}>
//               Full Name
//             </Label>
//             <Input
//               id="fullName"
//               name="fullName"
//               value={userData.fullName}
//               onChange={handleInputChange}
//               className={inputStyles}
//               required
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="email" className={labelStyles}>
//               Email
//             </Label>
//             <Input
//               id="email"
//               name="email"
//               value={userData.email}
//               onChange={handleInputChange}
//               className={inputStyles}
//               required
//               type="email"
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="phoneNumber" className={labelStyles}>
//               Phone Number
//             </Label>
//             <Input
//               id="phoneNumber"
//               name="phoneNumber"
//               value={userData.phoneNumber}
//               onChange={handleInputChange}
//               className={inputStyles}
//               type="tel"
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="location" className={labelStyles}>
//               Location
//             </Label>
//             <Input
//               id="location"
//               name="location"
//               value={userData.location}
//               onChange={handleInputChange}
//               className={inputStyles}
//             />
//           </div>

//           {userData.role === "student" && (
//             <>
//               <div className="space-y-2">
//                 <Label htmlFor="university" className={labelStyles}>
//                   University
//                 </Label>
//                 <Input
//                   id="university"
//                   name="university"
//                   value={userData.university}
//                   onChange={handleInputChange}
//                   className={inputStyles}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="course" className={labelStyles}>
//                   Course
//                 </Label>
//                 <Input
//                   id="course"
//                   name="course"
//                   value={userData.course}
//                   onChange={handleInputChange}
//                   className={inputStyles}
//                 />
//               </div>
//             </>
//           )}

//           {userData.role === "professor" && (
//             <>
//               <div className="space-y-2">
//                 <Label htmlFor="title" className={labelStyles}>
//                   Title
//                 </Label>
//                 <Input
//                   id="title"
//                   name="title"
//                   value={userData.title}
//                   onChange={handleInputChange}
//                   className={inputStyles}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="department" className={labelStyles}>
//                   Department
//                 </Label>
//                 <Input
//                   id="department"
//                   name="department"
//                   value={userData.department}
//                   onChange={handleInputChange}
//                   className={inputStyles}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="researchInterests" className={labelStyles}>
//                   Research Interests
//                 </Label>
//                 <Textarea
//                   id="researchInterests"
//                   name="researchInterests"
//                   value={userData.researchInterests}
//                   onChange={handleInputChange}
//                   className={inputStyles}
//                 />
//               </div>
//             </>
//           )}

//           {userData.role === "business" && (
//             <>
//               <div className="space-y-2">
//                 <Label htmlFor="companyName" className={labelStyles}>
//                   Company Name
//                 </Label>
//                 <Input
//                   id="companyName"
//                   name="companyName"
//                   value={userData.companyName}
//                   onChange={handleInputChange}
//                   className={inputStyles}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="industry" className={labelStyles}>
//                   Industry
//                 </Label>
//                 <Input
//                   id="industry"
//                   name="industry"
//                   value={userData.industry}
//                   onChange={handleInputChange}
//                   className={inputStyles}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="description" className={labelStyles}>
//                   Company Description
//                 </Label>
//                 <Textarea
//                   id="description"
//                   name="description"
//                   value={userData.description}
//                   onChange={handleInputChange}
//                   className={inputStyles}
//                 />
//               </div>
//             </>
//           )}

//           <Button type="submit" className={`w-full ${buttonStyles}`}>
//             Update Profile
//           </Button>
//         </form>

//         {error && (
//           <Alert className="mt-4 bg-red-100 text-red-800 border-red-300">
//             <AlertDescription>{error}</AlertDescription>
//           </Alert>
//         )}

//         {successMessage && (
//           <Alert className="mt-4 bg-green-100 text-green-800 border-green-300">
//             <AlertDescription>{successMessage}</AlertDescription>
//           </Alert>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default EditProfileForm;
