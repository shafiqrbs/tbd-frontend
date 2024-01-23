import { TextInput, Checkbox, Button, Group, Box,Input, Tooltip } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { IconBrandTwitter, IconAlertCircle } from '@tabler/icons-react';
import Dictaphone from "./SpeechRecognition";
export function ArticaleCard() {
    const form = useForm({
        initialValues: {
            email: '',
            termsOfService: false,
        },

        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        },
    });
    const [focused, setFocused] = useState(false);

    return (
        <Box className="p-5" mx="auto">
            <div className="bg-white py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl sm:text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Simple no-tricks
                            pricing</h2>
                        <Dictaphone></Dictaphone>
                    </div>
                    <div
                        className="mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
                        <div className="p-8 sm:p-10 lg:flex-auto">
                            <h3 className="text-2xl font-bold tracking-tight text-gray-900">Lifetime membership</h3>
                            <p className="mt-6 text-base leading-7 text-gray-600">Lorem ipsum dolor sit amet consect
                                etur adipisicing elit. Itaque amet indis perferendis blanditiis repellendus etur quidem
                                assumenda.</p>
                            <div className="mt-10 flex items-center gap-x-4">
                                <h4 className="flex-none text-sm font-semibold leading-6 text-indigo-600">What’s
                                    included</h4>
                                <div className="h-px flex-auto bg-gray-100"></div>
                            </div>
                            <ul role="list"
                                className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-2 sm:gap-6">
                                <li className="flex gap-x-3">
                                   <IconBrandTwitter></IconBrandTwitter>
                                    Private forum access
                                </li>
                                <li className="flex gap-x-3">
                                    <svg className="h-6 w-5 flex-none text-indigo-600" viewBox="0 0 20 20"
                                         fill="currentColor" aria-hidden="true">
                                        <path fill-rule="evenodd"
                                              d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                              clip-rule="evenodd"/>
                                    </svg>
                                    Member resources
                                </li>
                                <li className="flex gap-x-3">
                                    <svg className="h-6 w-5 flex-none text-indigo-600" viewBox="0 0 20 20"
                                         fill="currentColor" aria-hidden="true">
                                        <path fill-rule="evenodd"
                                              d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                              clip-rule="evenodd"/>
                                    </svg>
                                    Entry to annual conference
                                </li>
                                <li className="flex gap-x-3">
                                    <svg className="h-6 w-5 flex-none text-indigo-600" viewBox="0 0 20 20"
                                         fill="currentColor" aria-hidden="true">
                                        <path fill-rule="evenodd"
                                              d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                              clip-rule="evenodd"/>
                                    </svg>
                                    Official member t-shirt
                                </li>
                            </ul>
                        </div>
                        <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
                            <div
                                className="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
                                <div className="mx-auto max-w-xs px-8">
                                    <p className="text-base font-semibold text-gray-600">Pay once, own it forever</p>
                                    <p className="mt-6 flex items-baseline justify-center gap-x-2">
                                        <span className="text-5xl font-bold tracking-tight text-gray-900">$349</span>
                                        <span
                                            className="text-sm font-semibold leading-6 tracking-wide text-gray-600">USD</span>
                                    </p>
                                    <a href="#"
                                       className="mt-10 block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Get
                                        access</a>
                                    <p className="mt-6 text-xs leading-5 text-gray-600">Invoices and receipts available
                                        for easy company reimbursement</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <form onSubmit={form.onSubmit((values) => console.log(values))}>

                <Input.Wrapper  id="input-demo"
                                withAsterisk
                                label="Credit card information"
                                description="Please enter your credit card information, we need some money"
                                error="Your credit card expired">
                <Input
                    icon={<IconBrandTwitter size="1rem" />}
                    placeholder="Your twitter"
                    id="input-demo"
                    size="xs"
                    rightSection={
                        <Tooltip label="This is public" position="top-end" withArrow>
                            <div>
                                <IconAlertCircle size="1rem" style={{ display: 'block', opacity: 0.5 }} />
                            </div>
                        </Tooltip>
                    }
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    inputContainer={(children) => (
                        <Tooltip label="Additional information" color="blue" position="top-start" opened={focused}>
                            {children}
                        </Tooltip>
                    )}
                    description="Description below the input"
                />
                </Input.Wrapper>
                <TextInput
                    label="TextInput with tooltip"
                    placeholder="Focus me to see tooltip"
                    description="Error and description are"
                    error="both below the input"
                    inputWrapperOrder={['label', 'input', 'description', 'error']}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    inputContainer={(children) => (
                        <Tooltip color="blue" label="Additional information" position="top-start" opened={focused}>
                            {children}
                        </Tooltip>
                    )}
                />
                <Checkbox
                    mt="md"
                    label="I agree to sell my privacy"
                    {...form.getInputProps('termsOfService', { type: 'checkbox' })}
                />


                <Group position="right" mt="md">
                    <Button type="submit">Submit</Button>
                </Group>
            </form>
        </Box>
    );
}