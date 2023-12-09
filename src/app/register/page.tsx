'use client';
import { useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useState } from 'react';

const RegisterPage = () => {
  const { isLoaded, setActive, signUp } = useSignUp();
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  const [formState, setFormState] = useState({
    userName: '',
    password: '',
    email: '',
  });
  const router = useRouter();

  const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => {
      return {
        ...prev,
        [target.name]: target.value,
      };
    });
  };

  const handleSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    if (!isLoaded) {
      return;
    }
    try {
      await signUp.create({
        emailAddress: formState.email,
        password: formState.password,
      });

      // send the email.
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      // change the UI to our pending section.
      setPendingVerification(true);
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const onPressVerify = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (completeSignUp.status !== 'complete') {
        /*  investigate the response, to see if there was an error
           or if the user needs to complete more steps.*/
        console.log(JSON.stringify(completeSignUp, null, 2));
      }
      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push('/');
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <div className='flex justify-center mt-20'>
      {!pendingVerification ? (
        <form onSubmit={handleSubmit} className='flex flex-col w-1/3 gap-4'>
          <input
            className='border'
            type='text'
            name='userName'
            onChange={handleChange}
            value={formState.userName}
            placeholder='user name'
          />
          <input
            className='border'
            placeholder='email'
            type='text'
            name='email'
            onChange={handleChange}
            value={formState.email}
          />
          <input
            className='border'
            placeholder='password'
            type='text'
            name='password'
            onChange={handleChange}
            value={formState.password}
          />
          <button>submit</button>
        </form>
      ) : (
        <form onSubmit={onPressVerify}>
          <input
            value={code}
            placeholder='Code...'
            onChange={(e) => setCode(e.target.value)}
          />
          <button>Verify Email</button>
        </form>
      )}
    </div>
  );
};

export default RegisterPage;
