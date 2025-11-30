import * as React from "react";

interface EmailTemplateProps {
  client_name: string;
  date: string;
  time: string;
  subject: string;
  duration: string;
}

export function EmailTemplate({
  client_name,
  date,
  time,
  subject,
  duration,
}: EmailTemplateProps) {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        lineHeight: "1.6",
        color: "#333",
        maxWidth: "600px",
        margin: "0 auto",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          backgroundColor: "#4F46E5",
          color: "white",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <h1 style={{ margin: "0", fontSize: "24px" }}>Meeting Confirmation</h1>
      </div>
      <div style={{ padding: "30px 20px" }}>
        <h2 style={{ color: "#4F46E5", fontSize: "20px" }}>
          Hello {client_name},
        </h2>
        <p>
          This email is to confirm your upcoming meeting that has been
          scheduled.
        </p>
        <div
          style={{
            backgroundColor: "#f9f9f9",
            padding: "20px",
            borderRadius: "5px",
            border: "1px solid #eee",
            marginTop: "20px",
          }}
        >
          <h3
            style={{
              margin: "0 0 15px 0",
              color: "#4F46E5",
              borderBottom: "2px solid #e0e0e0",
              paddingBottom: "10px",
            }}
          >
            Meeting Details:
          </h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <td
                  style={{
                    padding: "10px 0",
                    fontWeight: "bold",
                    width: "120px",
                  }}
                >
                  Subject:
                </td>
                <td style={{ padding: "10px 0" }}>{subject}</td>
              </tr>
              <tr>
                <td style={{ padding: "10px 0", fontWeight: "bold" }}>Date:</td>
                <td style={{ padding: "10px 0" }}>{date}</td>
              </tr>
              <tr>
                <td style={{ padding: "10px 0", fontWeight: "bold" }}>Time:</td>
                <td style={{ padding: "10px 0" }}>{time}</td>
              </tr>
              <tr>
                <td style={{ padding: "10px 0", fontWeight: "bold" }}>
                  Duration:
                </td>
                <td style={{ padding: "10px 0" }}>{duration}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p style={{ marginTop: "30px", fontSize: "14px" }}>
          If you have any questions or need to reschedule, please contact us.
        </p>
        <p style={{ fontSize: "14px" }}>
          Best regards,
          <br />
          The Team
        </p>
      </div>
      <div
        style={{
          backgroundColor: "#f0f0f0",
          color: "#777",
          padding: "15px",
          textAlign: "center",
          fontSize: "12px",
        }}
      >
        <p style={{ margin: "0" }}>
          This is an automated message. Please do not reply directly.
        </p>
      </div>
    </div>
  );
}
