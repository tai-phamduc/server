const pages = [
  {
    title: 'About Us',
    slug: 'about-us',
    content: `
      <h1>About Our Cinema</h1>
      <p>Welcome to our cinema, where the magic of movies comes to life! We are dedicated to providing the ultimate movie-going experience for film enthusiasts of all ages.</p>

      <h2>Our Story</h2>
      <p>Founded in 2010, our cinema began as a small, independent theater with a passion for showcasing both mainstream blockbusters and arthouse gems. Over the years, we've grown into a premier destination for movie lovers, with multiple locations across the country.</p>

      <h2>Our Mission</h2>
      <p>Our mission is to create memorable cinematic experiences that transport audiences into the world of film. We believe in the power of storytelling and its ability to inspire, educate, and entertain.</p>

      <h2>State-of-the-Art Facilities</h2>
      <p>All our theaters are equipped with the latest projection and sound technologies, comfortable seating, and premium amenities to ensure an immersive viewing experience. From IMAX to Dolby Atmos, we invest in technologies that bring movies to life.</p>

      <h2>Community Involvement</h2>
      <p>We are proud to be an active part of the communities we serve. Through educational programs, film festivals, and charity events, we strive to give back and foster a love for cinema in future generations.</p>

      <h2>Sustainability Commitment</h2>
      <p>We are committed to reducing our environmental footprint through energy-efficient operations, waste reduction initiatives, and sustainable sourcing practices. Our goal is to provide entertainment while preserving the planet for future generations.</p>
    `,
    excerpt: 'Learn about our cinema\'s history, mission, and commitment to providing exceptional movie experiences.',
    featuredImage: 'https://example.com/images/about-us.jpg',
    status: 'published',
    template: 'default',
    order: 1,
    isInMenu: true,
    isInFooter: true,
    metaTitle: 'About Our Cinema | Learn Our Story',
    metaDescription: 'Discover the story behind our cinema, our mission, and our commitment to providing exceptional movie experiences for all film enthusiasts.',
    metaKeywords: ['about us', 'cinema history', 'movie theater', 'film experience']
  },
  {
    title: 'Terms & Conditions',
    slug: 'terms-and-conditions',
    content: `
      <h1>Terms and Conditions</h1>
      <p>Please read these terms and conditions carefully before using our website and services.</p>

      <h2>1. Acceptance of Terms</h2>
      <p>By accessing or using our website, booking tickets, or using any of our services, you agree to be bound by these Terms and Conditions. If you do not agree to all the terms and conditions, you must not use our website or services.</p>

      <h2>2. Changes to Terms</h2>
      <p>We reserve the right to modify these terms at any time. Your continued use of the website following the posting of changes constitutes your acceptance of such changes.</p>

      <h2>3. Ticket Purchases</h2>
      <p>3.1. All ticket sales are final and non-refundable except as expressly stated in our refund policy.</p>
      <p>3.2. Tickets are valid only for the specified showtime and cannot be exchanged for other showtimes without prior approval.</p>
      <p>3.3. We reserve the right to refuse admission or ask customers to leave if they engage in disruptive behavior.</p>

      <h2>4. Account Registration</h2>
      <p>4.1. You may need to create an account to access certain features of our website.</p>
      <p>4.2. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.</p>
      <p>4.3. You agree to provide accurate and complete information when creating an account and to update your information as necessary.</p>

      <h2>5. Privacy Policy</h2>
      <p>Your use of our website and services is also governed by our Privacy Policy, which is incorporated by reference into these Terms and Conditions.</p>

      <h2>6. Intellectual Property</h2>
      <p>6.1. All content on this website, including text, graphics, logos, images, and software, is the property of our company or our content suppliers and is protected by copyright laws.</p>
      <p>6.2. You may not reproduce, distribute, modify, or create derivative works from any content without our express written consent.</p>

      <h2>7. Limitation of Liability</h2>
      <p>7.1. We shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use our services.</p>
      <p>7.2. Our liability is limited to the amount paid by you for the specific service or ticket purchase.</p>

      <h2>8. Governing Law</h2>
      <p>These Terms and Conditions shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.</p>

      <h2>9. Contact Information</h2>
      <p>If you have any questions about these Terms and Conditions, please contact us at [Your Contact Information].</p>
    `,
    excerpt: 'Read our terms and conditions for using our website and services.',
    featuredImage: 'https://example.com/images/terms.jpg',
    status: 'published',
    template: 'default',
    order: 2,
    isInMenu: false,
    isInFooter: true,
    metaTitle: 'Terms & Conditions | Our Cinema',
    metaDescription: 'Read the terms and conditions for using our cinema website and services, including ticket purchases, account registration, and more.',
    metaKeywords: ['terms and conditions', 'legal', 'cinema rules', 'ticket policy']
  },
  {
    title: 'Privacy Policy',
    slug: 'privacy-policy',
    content: `
      <h1>Privacy Policy</h1>
      <p>This Privacy Policy describes how we collect, use, and share your personal information when you visit our website or use our services.</p>

      <h2>1. Information We Collect</h2>
      <p>1.1. <strong>Personal Information:</strong> We may collect personal information such as your name, email address, phone number, and payment information when you create an account, make a purchase, or contact us.</p>
      <p>1.2. <strong>Usage Data:</strong> We automatically collect information about how you interact with our website, including the pages you visit, the time and date of your visit, and the browser you use.</p>
      <p>1.3. <strong>Cookies and Similar Technologies:</strong> We use cookies and similar tracking technologies to enhance your experience on our website and collect information about your browsing activities.</p>

      <h2>2. How We Use Your Information</h2>
      <p>2.1. To provide and maintain our services, including processing transactions and sending confirmation emails.</p>
      <p>2.2. To improve our website and services based on your feedback and usage patterns.</p>
      <p>2.3. To communicate with you about promotions, upcoming events, and other news.</p>
      <p>2.4. To protect against fraudulent or unauthorized transactions.</p>
      <p>2.5. To comply with legal obligations and resolve disputes.</p>

      <h2>3. Information Sharing and Disclosure</h2>
      <p>3.1. <strong>Service Providers:</strong> We may share your information with third-party service providers who help us operate our business, such as payment processors and email service providers.</p>
      <p>3.2. <strong>Legal Requirements:</strong> We may disclose your information if required by law or in response to valid requests by public authorities.</p>
      <p>3.3. <strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction.</p>

      <h2>4. Data Security</h2>
      <p>We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.</p>

      <h2>5. Your Rights</h2>
      <p>Depending on your location, you may have rights regarding your personal information, including:</p>
      <p>5.1. The right to access the personal information we hold about you.</p>
      <p>5.2. The right to request correction of inaccurate information.</p>
      <p>5.3. The right to request deletion of your information.</p>
      <p>5.4. The right to object to or restrict certain processing activities.</p>

      <h2>6. Children's Privacy</h2>
      <p>Our services are not intended for individuals under the age of 13. We do not knowingly collect personal information from children under 13.</p>

      <h2>7. Changes to This Privacy Policy</h2>
      <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.</p>

      <h2>8. Contact Us</h2>
      <p>If you have any questions about this Privacy Policy, please contact us at [Your Contact Information].</p>
    `,
    excerpt: 'Learn how we collect, use, and protect your personal information.',
    featuredImage: 'https://example.com/images/privacy.jpg',
    status: 'published',
    template: 'default',
    order: 3,
    isInMenu: false,
    isInFooter: true,
    metaTitle: 'Privacy Policy | Our Cinema',
    metaDescription: 'Learn how we collect, use, and protect your personal information when you use our cinema website and services.',
    metaKeywords: ['privacy policy', 'data protection', 'personal information', 'cookies']
  },
  {
    title: 'FAQ',
    slug: 'faq',
    content: `
      <h1>Frequently Asked Questions</h1>
      <p>Find answers to commonly asked questions about our cinema, tickets, and services.</p>

      <h2>General Questions</h2>
      <div class="faq-item">
        <h3>How do I create an account?</h3>
        <p>To create an account, click on the "Sign Up" button in the top right corner of the website. Fill in your details including name, email, and password. Once submitted, you'll receive a verification email. Click the link in the email to verify your account and start using all features of our website.</p>
      </div>

      <div class="faq-item">
        <h3>How can I reset my password?</h3>
        <p>If you've forgotten your password, click on the "Login" button, then select "Forgot Password". Enter your email address and we'll send you a password reset link. Follow the instructions in the email to create a new password.</p>
      </div>

      <h2>Tickets & Booking</h2>
      <div class="faq-item">
        <h3>How do I book movie tickets?</h3>
        <p>To book movie tickets, browse our "Now Showing" section, select the movie you want to watch, choose your preferred date, time, and theater, select your seats, and proceed to checkout. You can pay using credit/debit cards, digital wallets, or gift cards.</p>
      </div>

      <div class="faq-item">
        <h3>Can I cancel or change my booking?</h3>
        <p>Yes, you can cancel or change your booking up to 2 hours before the showtime. Go to "My Bookings" in your account, select the booking you wish to modify, and follow the instructions. Please note that some special screenings may have different cancellation policies.</p>
      </div>

      <h2>Theaters & Facilities</h2>
      <div class="faq-item">
        <h3>What facilities are available at your theaters?</h3>
        <p>Our theaters offer comfortable seating, state-of-the-art sound and projection systems, concession stands with a variety of food and beverages, wheelchair accessibility, and clean restrooms. Premium theaters may include recliner seats, in-theater dining, and bar service.</p>
      </div>

      <div class="faq-item">
        <h3>Are your theaters wheelchair accessible?</h3>
        <p>Yes, all our theaters are wheelchair accessible with designated spaces for wheelchair users. We also provide accessible restrooms and parking spaces. If you need any special assistance, please contact the theater in advance or speak to our staff upon arrival.</p>
      </div>

      <h2>For more information</h2>
      <p>If you can't find the answer to your question here, please visit our <a href="/contact">Contact Us</a> page or call our customer service at (123) 456-7890.</p>
    `,
    excerpt: 'Find answers to commonly asked questions about our cinema, tickets, and services.',
    featuredImage: 'https://example.com/images/faq.jpg',
    status: 'published',
    template: 'default',
    order: 4,
    isInMenu: true,
    isInFooter: true,
    metaTitle: 'Frequently Asked Questions | Our Cinema',
    metaDescription: 'Find answers to commonly asked questions about our cinema, tickets, booking process, facilities, and services.',
    metaKeywords: ['FAQ', 'questions', 'help', 'cinema information', 'ticket booking']
  },
  {
    title: 'Contact Us',
    slug: 'contact-us',
    content: `
      <h1>Contact Us</h1>
      <p>We'd love to hear from you! Please use the form below to get in touch with us, or reach out through one of our other contact methods.</p>

      <div class="contact-form-container">
        <form id="contact-form">
          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" name="name" required>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>
          </div>

          <div class="form-group">
            <label for="phone">Phone (optional)</label>
            <input type="tel" id="phone" name="phone">
          </div>

          <div class="form-group">
            <label for="subject">Subject</label>
            <input type="text" id="subject" name="subject" required>
          </div>

          <div class="form-group">
            <label for="message">Message</label>
            <textarea id="message" name="message" rows="5" required></textarea>
          </div>

          <button type="submit" class="btn-primary">Send Message</button>
        </form>
      </div>

      <div class="contact-info">
        <h2>Other Ways to Reach Us</h2>

        <div class="contact-method">
          <h3>Customer Service</h3>
          <p>Phone: (123) 456-7890</p>
          <p>Email: support@ourcinema.com</p>
          <p>Hours: Monday-Friday, 9am-6pm</p>
        </div>

        <div class="contact-method">
          <h3>Corporate Office</h3>
          <p>123 Movie Lane</p>
          <p>Hollywood, CA 90028</p>
          <p>Phone: (123) 456-7891</p>
          <p>Email: info@ourcinema.com</p>
        </div>

        <div class="contact-method">
          <h3>Theater Locations</h3>
          <p>For specific theater inquiries, please visit our <a href="/theaters">Theaters</a> page to find contact information for each location.</p>
        </div>
      </div>

      <div class="map-container">
        <h2>Find Us</h2>
        <div id="map">
          <!-- Map will be embedded here -->
          <img src="/images/map-placeholder.jpg" alt="Map location" class="placeholder-map">
        </div>
      </div>
    `,
    excerpt: 'Get in touch with us through our contact form or find our contact information.',
    featuredImage: 'https://example.com/images/contact.jpg',
    status: 'published',
    template: 'contact',
    order: 5,
    isInMenu: true,
    isInFooter: true,
    metaTitle: 'Contact Us | Our Cinema',
    metaDescription: 'Get in touch with our cinema through our contact form, phone, email, or visit our locations. We are here to help with your questions and feedback.',
    metaKeywords: ['contact us', 'customer service', 'cinema contact', 'help', 'support']
  }
];

module.exports = pages;
