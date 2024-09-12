import {
    Html, 
    Head,
    Preview,
    Heading,
    Row,
    Section,
    Text
} from "@react-email/components";
import * as React from "react";
interface VerificationEmailProps {
    username:string;
    otp:string;
}
export default function Verification ({username, otp}:VerificationEmailProps){
    return(
        <Html lang="en">
        <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Verification code </title>
        </Head>
        <body>
             <Preview>
                 Here&apos;s Your verification code :{otp}
             </Preview>
             <Section>
                <Row>
                    <Heading as="h2">Hello {username}</Heading>
                </Row>
                <Row>
                    <Text>
                        thankyou for registering. please use the following verification code to complete your registration:
                    </Text>
                </Row>
                <Row>
                    {otp}
                </Row>
                <Row>
                    <Text>
                        if you did not request this code, please ignore this email.
                    </Text>
                </Row>
             </Section>
        </body>
        </Html>
    )
}