import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup"
import { ForgotPasswordRequest } from '@/hooks/api/auth/authTypes';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios'
import useAuth from '@/hooks/api/auth/useAuth'
import VerifyCode from '@/app/forgot-password/verify-code'
import { router } from 'expo-router';
import { useCustomAlert } from '../context/CustomAlertProvider';

type SendCodeProps = {
  setPage: (value: number) => void
  setCredentials: (value: {
    email: string,
    password: string,
    code: string,
  }) => void
}

const emailSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
})

export default function EmailRequest({ setPage, setCredentials }: SendCodeProps) {
  const { forgotPassword } = useAuth()
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState<boolean>(false);
  const { showAlert } = useCustomAlert()


  const { control, handleSubmit, reset, watch, setValue, formState: { errors, isDirty, isValid } } = useForm<ForgotPasswordRequest>({
    defaultValues: { email: '' },
    resolver: yupResolver(emailSchema),
    mode: 'onChange',
  })

  const onSubmit = (data: any) => {
    console.log(data);
    // Add your logic to handle the form submission here
  };

  const handleForgotPasswword = async (id: ForgotPasswordRequest) => {
    try {
      const res = await forgotPassword(setForgotPasswordLoading, id)
      const data: ForgotPasswordRequest = res.data
      if (res.status === 200) {
        setCredentials({ email: id.email, password: '', code: '' });
        setPage(2)
      }
      console.log("[ForgotPasswordRequest]: ", id)
      return res.data
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;

        if (status === 400) {
          showAlert('Invalid request. Please check your input.', 'error');
        } else if (status === 500) {
          showAlert('A server error occurred. Please try again later.', 'error');
        } else {
          // showAlert(`An error occurred: ${status}. Please try again later.`, 'error');
        }
      } else {
        console.log('Unexpected Error:', err);
        showAlert('Please check your internet connection.', 'error');
      }

      return null
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => router.replace('/(auth)/login')}
      >
        <Ionicons name='arrow-back-outline' size={50} color='Black' />
      </TouchableOpacity>
      <View>
        <Text style={styles.title}>Lupa kata sandi</Text>
        <Text style={styles.subtitle}>Masukkan email anda untuk menerima kata sandi</Text>
      </View>

      <Image
        source={require('@/assets/images/forgot-password/forgot.png')}
        style={styles.img}
      />

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <View>
            <Text style={styles.labelInput}>Email</Text>
            <TextInput
              style={[
                styles.input,
                errors.email && styles.inputError,
              ]}
              onChangeText={onChange}
              value={value}
              placeholder="Email"
              keyboardType="email-address"
            />
          </View>
        )}
      />
      {errors.email && (
        <Text style={styles.errorText}>{errors.email.message}</Text>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit(handleForgotPasswword)}
      >
        <Text style={styles.buttonText}>Kirim tautan</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    flex: 1,
  },
  contentContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '90%',
  },
  title: {
    marginBottom: -6,
    fontSize: 32,
    fontFamily: 'Helvetica-Bold'
  },
  subtitle: {
    marginBottom: 16,
    color: '#969696',
    fontSize: 16,
    fontFamily: 'Helvetica',
  },
  img: {
    marginHorizontal: 'auto',
    marginBottom: 5,
    width: 330,
    height: 150,
    objectFit: 'cover',
  },
  labelInput: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 12,
    marginBottom: 8,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
  },
  button: {
    marginTop: 'auto',
    height: 60,
    backgroundColor: '#DA6E35',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'Helvetica-Bold'
  },
});