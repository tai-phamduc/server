const faqs = [
  // General FAQs
  {
    question: 'How do I create an account?',
    answer: 'To create an account, click on the "Sign Up" button in the top right corner of the website. Fill in your details including name, email, and password. Once submitted, you\'ll receive a verification email. Click the link in the email to verify your account and start using all features of our website.',
    category: 'General',
    order: 1
  },
  {
    question: 'How can I reset my password?',
    answer: 'If you\'ve forgotten your password, click on the "Login" button, then select "Forgot Password". Enter your email address and we\'ll send you a password reset link. Follow the instructions in the email to create a new password.',
    category: 'General',
    order: 2
  },
  {
    question: 'Is my personal information secure?',
    answer: 'Yes, we take data security very seriously. All personal information is encrypted and stored securely. We never share your information with third parties without your consent. For more details, please review our Privacy Policy.',
    category: 'General',
    order: 3
  },
  {
    question: 'How can I contact customer support?',
    answer: 'You can contact our customer support team through the "Contact Us" page on our website. Fill out the form with your query, and we\'ll get back to you within 24 hours. For urgent matters, you can also call our support line at (123) 456-7890.',
    category: 'General',
    order: 4
  },
  
  // Tickets & Booking FAQs
  {
    question: 'How do I book movie tickets?',
    answer: 'To book movie tickets, browse our "Now Showing" section, select the movie you want to watch, choose your preferred date, time, and theater, select your seats, and proceed to checkout. You can pay using credit/debit cards, digital wallets, or gift cards.',
    category: 'Tickets & Booking',
    order: 1
  },
  {
    question: 'Can I cancel or change my booking?',
    answer: 'Yes, you can cancel or change your booking up to 2 hours before the showtime. Go to "My Bookings" in your account, select the booking you wish to modify, and follow the instructions. Please note that some special screenings may have different cancellation policies.',
    category: 'Tickets & Booking',
    order: 2
  },
  {
    question: 'How do I get my tickets after booking online?',
    answer: 'After completing your booking, you\'ll receive an email with your e-tickets. You can either print these tickets or show the QR code on your mobile device at the theater. If you have our app, your tickets will also be available in the "My Tickets" section.',
    category: 'Tickets & Booking',
    order: 3
  },
  {
    question: 'Are there any booking fees?',
    answer: 'We charge a small convenience fee for online bookings, which varies depending on the payment method and ticket type. The fee is clearly displayed during the checkout process before you confirm your payment.',
    category: 'Tickets & Booking',
    order: 4
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit and debit cards (Visa, Mastercard, American Express), digital wallets (Apple Pay, Google Pay), and our own gift cards. Some theaters also support payment through loyalty points.',
    category: 'Tickets & Booking',
    order: 5
  },
  
  // Theaters & Facilities FAQs
  {
    question: 'What facilities are available at your theaters?',
    answer: 'Our theaters offer comfortable seating, state-of-the-art sound and projection systems, concession stands with a variety of food and beverages, wheelchair accessibility, and clean restrooms. Premium theaters may include recliner seats, in-theater dining, and bar service.',
    category: 'Theaters & Facilities',
    order: 1
  },
  {
    question: 'Are your theaters wheelchair accessible?',
    answer: 'Yes, all our theaters are wheelchair accessible with designated spaces for wheelchair users. We also provide accessible restrooms and parking spaces. If you need any special assistance, please contact the theater in advance or speak to our staff upon arrival.',
    category: 'Theaters & Facilities',
    order: 2
  },
  {
    question: 'Can I bring outside food and drinks?',
    answer: 'Outside food and drinks are generally not allowed in our theaters. However, we offer a wide selection of snacks, meals, and beverages at our concession stands. Exceptions may be made for medical reasons or baby food.',
    category: 'Theaters & Facilities',
    order: 3
  },
  {
    question: 'Do you have parking facilities?',
    answer: 'Most of our theaters have dedicated parking facilities. Some locations offer free parking, while others may charge a fee. Parking validation is available at select theaters when you purchase a movie ticket.',
    category: 'Theaters & Facilities',
    order: 4
  },
  
  // Movies & Content FAQs
  {
    question: 'How often do you update your movie listings?',
    answer: 'We update our movie listings every Tuesday for the upcoming week. However, blockbuster releases and special screenings may be added to the schedule earlier. Check our website or app regularly for the most up-to-date information.',
    category: 'Movies & Content',
    order: 1
  },
  {
    question: 'Do you show movies with subtitles?',
    answer: 'Yes, we offer subtitled screenings for most foreign language films. We also provide special screenings with subtitles for the hearing impaired. Check the movie details or contact your local theater for specific subtitle information.',
    category: 'Movies & Content',
    order: 2
  },
  {
    question: 'What types of movies do you show?',
    answer: 'We show a diverse range of movies including Hollywood blockbusters, independent films, foreign cinema, documentaries, animated features, and classics. We also host special events like film festivals, director retrospectives, and themed movie marathons.',
    category: 'Movies & Content',
    order: 3
  },
  {
    question: 'How can I request a specific movie to be shown?',
    answer: 'We welcome movie suggestions from our customers. You can submit your requests through the "Contact Us" form on our website, specifying the movie you\'d like to see. While we can\'t guarantee all requests will be fulfilled, we do consider customer preferences when planning our schedules.',
    category: 'Movies & Content',
    order: 4
  },
  
  // Membership & Rewards FAQs
  {
    question: 'What are the benefits of becoming a member?',
    answer: 'Members enjoy benefits such as discounted tickets, exclusive previews, birthday offers, points on purchases that can be redeemed for free tickets or concessions, and regular newsletters with special promotions. Premium membership tiers offer additional perks like free upgrades and partner discounts.',
    category: 'Membership & Rewards',
    order: 1
  },
  {
    question: 'How do I earn and redeem reward points?',
    answer: 'You earn points on every ticket and concession purchase when logged into your account. Points are automatically added to your account after each transaction. To redeem, select "Use Points" during checkout or at the concession stand. Points can be used for ticket purchases, food and beverage items, or merchandise.',
    category: 'Membership & Rewards',
    order: 2
  },
  {
    question: 'Is there a fee to join the membership program?',
    answer: 'Our basic membership is completely free. We also offer premium tiers with annual fees that provide enhanced benefits. The cost and benefits of each tier are detailed on the Membership page of our website.',
    category: 'Membership & Rewards',
    order: 3
  },
  {
    question: 'How long are my reward points valid?',
    answer: 'Reward points are valid for 12 months from the date they are earned. Points will expire if your account is inactive (no earning or redemption) for a period of 12 consecutive months. Premium members enjoy extended point validity periods.',
    category: 'Membership & Rewards',
    order: 4
  }
];

module.exports = faqs;
