import {
  Body,
  Container,
  Column,
  Head,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
  Button,
} from '@react-email/components';
import React from 'react';

interface ForgotPasswordEmailProps {
  username?: string;
  token?: string;
}

const baseUrl = process.env.FRONTEND_URL ? `${process.env.FRONTEND_URL}` : '';

export const ForgotPasswordEmail = ({
  username,
  token,
}: ForgotPasswordEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>If you requested to change your password....</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logo}>
            <Img width={114} src={`${baseUrl}/logo-symbol.svg`} />
          </Section>
          <Section style={sectionsBorders}>
            <Row>
              <Column style={sectionBorder} />
              <Column style={sectionCenter} />
              <Column style={sectionBorder} />
            </Row>
          </Section>
          <Section style={content}>
            <Text style={paragraph}>Hi {username},</Text>
            <Text style={paragraph}>
              If you requested to change your password, the link to change is
              below:
              <Button
                style={button}
                href={`${baseUrl}/auth/forgot-password/reset?token=${token}`}
              >
                Reset password
              </Button>
            </Text>

            <Text style={paragraph}>
              Thanks,
              <br />
              Twitch Support Team
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default ForgotPasswordEmail;

const fontFamily = '"Inter", Roboto, HelveticaNeue,Helvetica,Arial,sans-serif';

const main = {
  backgroundColor: '#efeef1',
  fontFamily,
};

const button = {
  backgroundColor: 'rgb(10, 10, 40)',
  borderRadius: '4px',
  color: '#fff',
  fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
  fontSize: '15px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '210px',
  padding: '14px 7px',
};

const paragraph = {
  lineHeight: 1.5,
  fontSize: 14,
};

const container = {
  maxWidth: '580px',
  margin: '30px auto',
  backgroundColor: '#ffffff',
};

const content = {
  padding: '5px 20px 10px 20px',
};

const logo = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 30,
};

const sectionsBorders = {
  width: '100%',
  display: 'flex',
};

const sectionBorder = {
  borderBottom: '1px solid rgb(238,238,238)',
  width: '249px',
};

const sectionCenter = {
  borderBottom: '1px solid rgb(10, 10, 40)',
  width: '102px',
};
