'use server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitWaitlist(fanEmail: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'AURA DropCircles <onboarding@resend.dev>',
      to: 'genesisraaiin@gmail.com',
      subject: 'New Waitlist Access Request for EIGHT',
      html: `
        <div style="font-family: monospace; background: #000; color: #fff; padding: 40px;">
          <h2 style="text-transform: uppercase; letter-spacing: 2px;">New Visionary Request</h2>
          <p style="color: #a1a1aa;">A new fan has petitioned for access to the DropCircle:</p>
          <h3 style="color: #4ade80; font-size: 24px;">${fanEmail}</h3>
          <p style="color: #a1a1aa; margin-top: 40px; font-size: 10px; text-transform: uppercase;">
            Experience Infinite Greatness Here Today
          </p>
        </div>
      `
    });
    
    // If Resend rejects the email (e.g., bad API key), send a failure signal
    if (error) {
      console.error("Resend API Error:", error);
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    console.error("Server Crash:", error);
    return { success: false };
  }
}
