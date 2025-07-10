// Define an interface for FAQ items.
export interface FAQ {
    question: string;
    answer: string;
  }
  
  // You can optionally define a type for the entire groupInfo object if needed:
  export type GroupInfo = {
    [key: string]: string | FAQ[];
  };
  
  export const groupInfo: GroupInfo = {
    "Vip Signal": `
  <strong>Welcome to the  section! Please make sure you read the terms and conditions properly before proceeding to make a payment.</strong>
  
  <code>Terms and conditions VIP</code>
  
  <code>All information on how to manage the trades will be given, e.g. sl, tp, when to cut losses, when to break even, when to take partials and other things that will help your account grow.</code>
  
  <blockquote>
    <i>
    -- NO REFUNDS AFTER PAYMENT  
    -- YOU CAN SEND A COMPLAINT ONLY AFTER A MONTH OF USING SIGNALS AND FOLLOWING RULES 
    -- I TRADE ONLY XAUUSD ( Gold ) 
    -- Minimum 3-5 signals a week  
    -- Immediately your subscription expires you will be removed  
    -- 80% Win Rate
    </i>
  </blockquote>
    `,
  
    "Mentorship": `<strong>To learn how to be profitable and to learn KingFtp Trading strategy</strong>
  <strong>(KTS)</strong>`,
  
    "$10,000 - $49,000": `
  <strong>Here are the terms for fund management: You're willing to risk 100% of your capital and are comfortable with the risk.
  A $1000 one-time fee will be paid for service charge. A profit split structure of 50/50 is obtained.
  
  Fee breakdown</strong>
  <blockquote>
  -- Legal fee  
  -- Document preparation  
  -- Contract maintenance  
  -- Commitment charge
  </blockquote>
  <i>By agreeing you will be required to make a one-time deposit of $1000 to proceed to fund management. Send a screenshot of payment once you're done.</i>
  `,
  
    "$50,000 - $1 million": `
  <strong>Fund Management Terms and Conditions</strong>
  <strong>Investment Range:</strong>
  <blockquote>
    <i>The Client invests an amount between $50,000 and $1,000,000 for management by KingFtp.
    The Client acknowledges the inherent risks and is willing to risk a specified percentage of their investment. They agree to accept potential losses up to this percentage and will not hold KingFtp liable for any losses incurred.</i>
  </blockquote>
  <strong>Return on Investment (ROI) Expectation:</strong>
  <blockquote>
    <i>The Client expects an ROI of a specified percentage per annum, which KingFtp will strive to achieve but does not guarantee.</i>
  </blockquote>
  <strong>Liability Waiver:</strong>
  <blockquote>
    <i>The Client will not hold KingFtp responsible for any losses, damages, or expenses incurred during fund management.</i>
  </blockquote>
  <strong>Follow-Up and Communication:</strong>
  <blockquote>
    <i>The Client has the right to schedule follow-up calls or meetings. They are responsible for all associated logistics, including flight, hotel, and travel expenses.</i>
  </blockquote>
  <strong>Confidentiality:</strong>
  <blockquote>
    <i>Both parties agree to maintain confidentiality regarding all aspects of this Agreement.</i>
  </blockquote>
  <strong>Termination:</strong>
  <blockquote>
    <i>Either party can terminate the Agreement with written notice. Upon termination, the remaining funds, minus any outstanding fees or losses, will be returned to the Client.</i>
  </blockquote>
  <strong>Governing Law:</strong>
  <blockquote>
    <i>The Agreement is governed by the laws of the relevant jurisdiction.</i>
  </blockquote>
  <strong>Entire Agreement and Amendments:</strong>
  <blockquote>
    <i>This Agreement is the complete understanding between the Client and KingFtp and can only be amended in writing and signed by both parties.</i>
  </blockquote>
  <strong>
    <i>By choosing “agree” the client agrees to the above-stated terms. A document will be forwarded to you to complete the agreement procedure and KingFtp will reach out to you personally to further discuss the process and answer any further questions.</i>
  </strong>
  `,
  
    "Agree Two": `<blockquote><i>You'd be redirected to send a direct message to KingFtp so he can contact you and give you the next update.</i></blockquote>`,
  
    "3 Days BootCamp": `3 days boot camp Fee : $79.9`,
  
    "FAQs": [
      {
        "question": "1. How much is KingFtp signal, how do I pay, and how do I signup?",
        "answer": "KingFtp signal is worth $52 monthly, $130 for 3 months, $240 for 6 months, $400 for 1 year. Go to the main menu and choose a package."
      },
      {
        "question": "2. How are signals sent, what format are they sent?",
        "answer": "STOP ORDERS (BUY STOP, SELL STOP) and instant execution."
      },
      {
        "question": "3. What time are signals sent?",
        "answer": "Around 6 am WAT - 3 pm WAT (pre London session to prime New York session)"
      },
      {
        "question": "4. What is the minimum capital to trade KingFtp signals?",
        "answer": "Minimum of $100 for a live account, no maximum; for proprietary firms, a minimum of $5000 with no maximum."
      },
      {
        "question": "5. Can I cancel my subscription and get a refund?",
        "answer": "You can choose to stop your subscription, but there is no refund; when the subscription is over, then it is over."
      }
    ],
  
    "FAQ": "Frequently Asked Questions (FAQ)"
  };