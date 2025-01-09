export type ThirdPartyLogin = {
    icon: string;
    altText: string;
}

export const thirdPartyLogins: ThirdPartyLogin[] = [
    {
        icon: '/apple.svg',
        altText: 'apple login icon',
    },
    {
        icon: '/google.svg',
        altText: 'google login icon',
    },
    {
        icon: '/facebook.svg',
        altText: 'facebook login icon',
    },
]

export const initialFormData = {
    email: "",
    password: "",
    confirmPassword: "",
    names: "",
    lastNames: "",
    mobile: "",
    phone: "",
    website: "",
}

export const initialFormErrors = {
    email: "",
    password: "",
    confirmPassword: "",
    names: "",
    lastNames: "",
    mobile: "",
    phone: "",
    terms: "",
}