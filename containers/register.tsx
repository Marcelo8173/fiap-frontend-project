/* eslint-disable @next/next/no-img-element */
import { useState } from 'react';
import { CiUser } from 'react-icons/ci';
import { executeRequest } from "../services/api";
import { useRouter } from 'next/router'

type ValuesProps = {
    name: string;
    password: string;
    email: string;
}

const Register = () => {
    const router = useRouter()
    const [values, setValues] = useState<ValuesProps>({
        email: '',
        name: '',
        password: ''
    });
    const [errorMsg, setErrorMsg] = useState<String[]>([]);
    const [successMsg, setSuccessMsg] = useState('');

    const setFormValues = (key: string, value: string) => {
        setErrorMsg([]);
        setValues({
            ...values,
            [key]: value
        });
    };

    const handleSaveForm = async () => {
        try {
            setErrorMsg([]);
            if (values.password.length < 6 || !values.password.includes('@')) {
                setErrorMsg([...errorMsg,'Senha inválida']);
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(values.email)) {
                setErrorMsg([...errorMsg,'Email inválido']);
            }

            if(values.name === '') {
                setErrorMsg([...errorMsg,'Nome é obrigatório']);
            }
            const result = await executeRequest('register', 'POST', values);
            if(result && result.data){
                setSuccessMsg('Cadastro efetuado com sucesso. Aguarde o redirecionamento');
                setTimeout(() => {
                    router.back();
                }, 2000);
            }

        } catch (e: any) {
            if (e?.response?.data?.error) {
                setErrorMsg([...errorMsg,e?.response?.data?.error]);
            } else {
                setErrorMsg([...errorMsg,'Ocorreu erro ao cadastrar um usuario']);
            }
        }
    }

    return (
        <div className="register-login">
            <img src="/logo.svg" alt="Logo Fiap" className="logo" />
            <div className="form">
                <>
                    {!!errorMsg && errorMsg?.map((item, index) => (
                        <p key={index}>{item}</p>
                    ))}
                     {!!successMsg && <p className='success'>{successMsg}</p>}
                </>
                <div>
                    <CiUser />
                    <input required type='text' placeholder="Name" onChange={(event) => setFormValues('name', event.target.value)} />
                </div>
                <div>
                    <img src="/mail.svg" alt="Login" />
                    <input required type='text' placeholder="Login" onChange={(event) => setFormValues('email', event.target.value)} />
                </div>

                <div>
                    <img src="/lock.svg" alt="Senha" />
                    <input required type='text' placeholder="Senha" onChange={(event) => setFormValues('password', event.target.value)} />
                </div>
                <button onClick={handleSaveForm}>Salvar</button>
            </div>
        </div>
    );
}
export { Register };