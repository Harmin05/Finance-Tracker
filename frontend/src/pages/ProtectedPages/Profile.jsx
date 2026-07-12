import React, { useEffect, useState } from "react";
import { object, string } from "yup";
import { Button, Card, CardBody, Spinner, Avatar } from "@nextui-org/react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../features/authenticate/authSlice";
import { updateLoader } from "../../features/loader/loaderSlice";
import { UpdateProfile } from "../../utils/Icons";
import avatarImg from "../../assets/avatar.webp";

import { UsernameInput, EmailInput } from "../../components/Inputs";
import {
  useGetUserDetailsQuery,
  useUpdateUserDetailsMutation,
} from "../../features/api/apiSlices/userApiSlice";
import validateForm from "../../utils/validateForm";

const Profile = () => {
  const dispatch = useDispatch();
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
  });
  const [errors, setErrors] = useState({});
  const [initialData, setInitialData] = useState({
    username: "",
    email: "",
  });

  const validationSchema = object({
    username: string()
      .required("Username is required.")
      .min(3, "Username must be atleast 3 characters long.")
      .max(20, "Username should not be more than 20 characters."),
    email: string().required("Email is required.").email("Invalid Email."),
  });

  const {
    data: userData,
    isLoading: userLoading,
    error: userError,
    refetch,
  } = useGetUserDetailsQuery();

  const [updateUser, { isLoading: updateLoading }] =
    useUpdateUserDetailsMutation();

  useEffect(() => {
    if (userData?.user) {
      setProfileData({
        username: userData.user.username,
        email: userData.user.email,
      });
      setInitialData({
        username: userData.user.username,
        email: userData.user.email,
      });
    }
  }, [userData]);

  useEffect(() => {
    if (userError) {
      toast.error(
        userError?.data?.error ||
          "An unexpected error occurred while fetching user data!"
      );
    }
  }, [userError]);

  const handleOnChange = (e) => {
    setProfileData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    validateForm(
      e.target.name,
      e.target.value,
      validationSchema,
      setErrors
    );
  };

  const { username, email } = profileData;

  const handleUpdate = async (e) => {
    try {
      e.preventDefault();

      if (
        username === initialData.username &&
        email === initialData.email
      ) {
        toast.error("No changes detected.");
        return;
      }

      dispatch(updateLoader(40));
      const res = await updateUser(profileData).unwrap();
      await dispatch(setCredentials(res.user));

      dispatch(updateLoader(60));
      toast.success(res.message || "Profile updated Successfully!");
      
      setInitialData({
        username: res.user.username,
        email: res.user.email,
      });
      
      refetch();
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.error || "Unexpected Internal Server Error!");
    } finally {
      dispatch(updateLoader(100));
    }
  };

  const hasErrors = Object.values(errors).some((error) => !!error);
  const isUnchanged = username === initialData.username && email === initialData.email;
  const isFormValid = !hasErrors && username && email;
  const isBtnDisabled = isUnchanged || !isFormValid;

  return (
    <div className="flex flex-col justify-center items-center w-full h-[90vh] space-y-6 px-4">
      <h4 className="text-2xl md:text-3xl lg:text-5xl mt-2 text-center font-calSans">
        My Profile
      </h4>
      <Card className="w-full max-w-[22rem] sm:max-w-[28rem] md:max-w-[32rem] py-6 shadow-md">
        {userLoading ? (
          <div className="flex justify-center items-center h-[20rem]">
            <Spinner size="lg" />
          </div>
        ) : (
          <CardBody className="flex flex-col items-center space-y-6">
            <div className="flex flex-col items-center space-y-2">
              <Avatar
                src={avatarImg}
                className="w-24 h-24 text-large"
                isBordered
                color="primary"
              />
              <h5 className="text-xl font-bold font-outfit text-secondary mt-2">
                {initialData.username || "User"}
              </h5>
              <p className="text-sm text-gray-500">{initialData.email}</p>
            </div>
            
            <form className="w-full flex flex-col gap-4 px-4 sm:px-8">
              <UsernameInput
                value={username}
                onChange={handleOnChange}
                errors={errors}
              />
              <EmailInput
                value={email}
                onChange={handleOnChange}
                errors={errors}
                noDescription
              />
              <Button
                fullWidth
                color="primary"
                onClick={handleUpdate}
                isDisabled={isBtnDisabled}
                isLoading={updateLoading}
                endContent={<UpdateProfile />}
                radius="sm"
                className="text-base py-6"
              >
                Update Profile
              </Button>
            </form>
          </CardBody>
        )}
      </Card>
    </div>
  );
};

export default Profile;
