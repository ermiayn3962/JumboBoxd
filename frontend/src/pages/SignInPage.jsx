
import { SignIn } from "@clerk/clerk-react";

function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#BCBDC0] to-[#565857]">
      <div className="bg-white rounded-xl p-6 shadow-2xl max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Welcome to the JumboBoxd</h1>
        <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
      </div>
    </div>
  );
}

export default SignInPage;