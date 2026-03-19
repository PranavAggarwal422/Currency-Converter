Currency Converter Web Application

Developed a fully responsive currency converter web application that performs real-time conversions using live exchange rates. The application emphasizes performance optimization, clean UI design, and a smooth user experience through efficient event handling and state management.

APIs Used:

Exchange Rate API – for fetching real-time currency conversion rates

Flags API – for displaying country flags dynamically

Key Features Implemented:

Real-time currency conversion with debounced input handling, preventing excessive API calls during rapid user input.

Caching system with a 10-minute expiry to reuse exchange rates and significantly reduce network overhead.

Dynamic flag updates with preloading for commonly used currencies, loading spinners, and fallback handling for image errors.

Currency swap functionality, dark/light theme toggle, and comprehensive form validation with clear error messaging.

Challenges Overcome & Skills Demonstrated:

Optimized API usage through caching and debouncing, improving application performance and reducing redundant requests.

Managed asynchronous behavior (API responses and flag loading delays) using event-driven programming and error handling.

Enhanced UI/UX by resolving layout issues (such as text and flag alignment) and implementing interactive UI components.

Integrated third-party APIs securely while handling error states to ensure application robustness.

Results:

Reduced API load by approximately 50%, leading to faster conversions.

Achieved consistent responsiveness across devices with no UI bugs observed during testing.
