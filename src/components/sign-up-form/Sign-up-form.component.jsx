import React, { useState } from "react";
import {
  createAuthUserWithEmailAndPassword,
  createUserDocumentFromAuth,
} from "../../utils/firebase/firebase.utils";
import FormInput from "../form-input/form-input-component";
import "./sign-up-form.styles.scss";
import Button from "../button/button.component";

export default function SignUpFormComponent() {
  const [formFields, setFormFields] = useState({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { displayName, email, password, confirmPassword } = formFields;

  const onChangeInput = (e) => {
    const { name, value } = e.target;

    setFormFields({ ...formFields, [name]: value });
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    try {
      const {
        proactiveRefresh: { user },
      } = await createAuthUserWithEmailAndPassword(email, password);

      // //console.log(user);

      await createUserDocumentFromAuth(user, { displayName });
    } catch (error) {
      if (error.code === "auth/email-already-in-use")
        alert("User already exist on the data base son");
    }
  };

  return (
    <div>
      <h2>Don't have an account?</h2>
      <h3>Sign up with your email</h3>
      <form onSubmit={onSubmitForm}>
        <FormInput
          label="Display Name"
          type="text"
          name="displayName"
          value={displayName}
          onChange={onChangeInput}
          required
        />
        <FormInput
          label="Email"
          type="email"
          name="email"
          value={email}
          onChange={onChangeInput}
          required
        />
        <FormInput
          label="Password"
          type="password"
          name="password"
          value={password}
          onChange={onChangeInput}
          required
        />
        <FormInput
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={onChangeInput}
          required
        />
        <Button buttonType="google" type="submit">
          Sign Up
        </Button>
      </form>
    </div>
  );
}
