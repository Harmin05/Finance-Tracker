import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";

import NavBar from "../components/NavBar";

import dashboard from "../assets/dashboard.webp";
import { StartNow, ThreeDots } from "../utils/Icons";

const Home = () => {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth?.user);

  return (
    <main className="w-full h-full">
      <NavBar />
      <div className="bg-primary-50 pb-16 pt-12 sm:pt-0 gap-y-12 flex flex-col sm:block min-h-[90vh] h-auto">
        <div className="w-full sm:h-[65vh] flex flex-col justify-center items-center order-2 sm:order-1">
          <h2 className="text-4xl md:text-5xl xl:text-7xl">
            Track your{" "}
            <TypeAnimation
              sequence={["Finances", 1000, "Expenses", 1000, "Incomes", 1000]}
              wrapper="span"
              speed={20}
              className="text-primary inline-block"
              repeat={Infinity}
            />{" "}
          </h2>
          <p className="text-sm sm:text-base lg:text-lg my-8 text-balance text-center w-[90%] xl:w-[60%]">
            Welcome to{" "}
            <span className="text-primary font-calSans">FinanceTracker</span>, your
            ultimate solution for managing your personal finances effectively.
            With FinanceTracker, you can easily track your expenses, monitor your
            income, and stay on top of your financial goals.
          </p>
          {currentUser ? (
            <Button
              color="primary"
              className="text-sm sm:text-base lg:text-lg lg:w-[14rem] px-6 py-6"
              radius="sm"
              startContent={<StartNow />}
              onPress={() => navigate("/dashboard")}
            >
              Go to Dashboard
            </Button>
          ) : (
            <Button
              color="primary"
              className="text-sm sm:text-base lg:text-lg lg:w-[14rem] px-6 py-6"
              radius="sm"
              startContent={<StartNow />}
              onPress={() => navigate("/register")}
            >
              Start using Now!
            </Button>
          )}
          {!currentUser && (
            <ThreeDots
              className="text-primary size-[2.5rem] mt-4 cursor-pointer"
              onClick={() => navigate("/login")}
            />
          )}
        </div>
        <img
          src={dashboard}
          alt="home image"
          className="w-[90%] xl:w-[80%] mx-auto rounded-xl border-3 border-gray-300"
        />

        {/* About Us Section */}
        <section className="w-[90%] xl:w-[80%] mx-auto mt-20 pb-12 border-t-1 border-gray-300 pt-16 order-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start text-left">
            <div>
              <h3 className="text-3xl md:text-4xl text-secondary mb-6 font-calSans font-bold">
                About <span className="text-primary">Finance Tracker</span>
              </h3>
              <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-4">
                Finance Tracker is your go-to platform for effortless personal financial management. We believe that tracking expenses and managing income shouldn't be a chore, but an empowering habit that helps you reach your financial milestones.
              </p>
              <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                Whether you want to budget for a large purchase, cut back on unnecessary spending, or simply understand where your money goes each month, Finance Tracker provides you with the visual tools and insights to do so.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col gap-6">
              <h4 className="text-xl font-bold text-secondary">Key Features</h4>
              <ul className="flex flex-col gap-4 text-left">
                <li className="flex items-start gap-3">
                  <span className="bg-primary-50 text-primary px-2 py-0.5 rounded-lg font-bold">✓</span>
                  <div>
                    <h5 className="font-semibold text-secondary">Income & Expense Tracking</h5>
                    <p className="text-sm text-gray-500">Log transactions instantly and categorize them to see exact spending patterns.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-primary-50 text-primary px-2 py-0.5 rounded-lg font-bold">✓</span>
                  <div>
                    <h5 className="font-semibold text-secondary">Insightful Analytics</h5>
                    <p className="text-sm text-gray-500">Visualize monthly trends with beautiful, easy-to-read charts and reports.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-primary-50 text-primary px-2 py-0.5 rounded-lg font-bold">✓</span>
                  <div>
                    <h5 className="font-semibold text-secondary">Secure Sessions</h5>
                    <p className="text-sm text-gray-500">Keep your data private and secure with encrypted sessions and token auth.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Home;
