# JWT & Encoding Toolkit

A comprehensive web-based toolkit for generating, decoding, and validating JWT tokens with support for multiple encoding schemes. Perfect for developers working with authentication systems, APIs, and token-based security.

## Features

### JWT Generation
- Generate access and refresh tokens with customizable payloads
- Add unlimited custom claims to token payloads
- Configure token expiration time in seconds
- Secure HMAC-SHA256 signing
- Automatic refresh token creation (24x longer expiration than access token)
- One-click copy-to-clipboard functionality

### JWT Decoding & Validation
- Decode any JWT token to view header, payload, and signature
- Verify token signatures with secret keys
- Validate token structure and format
- Inspect all token claims and metadata

### Encoding & Decoding
- **Base32**: Case-insensitive encoding for systems with limited character sets
- **Base64**: Standard encoding for binary data
- **Base64URL**: URL-safe variant (replaces + with -, / with _)
- **Hexadecimal**: Binary representation using 0-9 and A-F
- Bidirectional encoding/decoding with one-click mode toggle

### Token History
- Automatic persistence of all generated tokens to Supabase database
- View recent token generation history (up to 20 most recent)
- Sort tokens by type (access/refresh) and creation time
- Copy individual tokens to clipboard
- Delete specific tokens or clear entire history
- Timestamps for all token entries

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Backend**: Supabase (PostgreSQL database)
- **Build Tool**: Vite
- **Cryptography**: Web Crypto API (HMAC-SHA256)

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- Supabase account with connection details

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd jwt-encoding-toolkit
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env` file in the root directory:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Usage

### Generating JWT Tokens

1. Navigate to the **JWT Generator** tab
2. Add or modify payload fields (key-value pairs):
   - Pre-populated with example fields: `sub` and `name`
   - Click "Add Field" to include additional claims
   - Remove fields by clicking the "Remove" button
3. Enter your secret key (minimum recommended: 32 characters)
4. Set token expiration time in seconds (3600 = 1 hour)
5. Click "Generate Tokens"
6. Both access and refresh tokens will be generated and displayed
7. Copy tokens using the copy button

**Example Payload:**
```json
{
  "sub": "user123",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "admin"
}
```

### Decoding JWT Tokens

1. Navigate to the **JWT Decoder** tab
2. Paste your JWT token in the input field
3. Click "Decode Token"
4. View the decoded header, payload, and signature
5. (Optional) Enter the secret key and click "Verify Signature" to validate authenticity

### Using Encoding Tools

1. Navigate to the **Encoding Tools** tab
2. Select your desired encoding type:
   - Base32
   - Base64
   - Base64URL
   - Hexadecimal
3. Choose mode: **Encode** or **Decode**
4. Enter your input text
5. Click the encode/decode button
6. View the output in the results section

**Quick Mode Toggle:**
- Click the arrow button to swap input/output and toggle between encode/decode modes

### Viewing Token History

1. Navigate to the **History** tab
2. Browse your recently generated tokens
3. Filter by token type (access/refresh) via color indicators
4. Copy individual tokens with one click
5. Delete specific tokens or clear entire history
6. All history is persisted to your Supabase database

## Project Structure

```
src/
├── components/
│   ├── JWTGenerator.tsx      # Access & refresh token generation
│   ├── JWTDecoder.tsx        # JWT decoding and verification
│   ├── EncodingTools.tsx     # Encoding/decoding utilities
│   └── TokenHistory.tsx      # Token history with database
├── utils/
│   ├── jwt.ts                # JWT creation, decoding, verification
│   └── encoding.ts           # Base32, Base64, Base64URL, Hex
├── types/
│   └── jwt.ts                # TypeScript type definitions
├── lib/
│   └── supabase.ts           # Supabase client configuration
├── App.tsx                   # Main application component
├── main.tsx                  # React entry point
└── index.css                 # Global styles
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint checks
- `npm run typecheck` - Run TypeScript type checking

## Database Schema

The `token_history` table stores all generated tokens:

```sql
token_history (
  id: uuid (primary key)
  token: text
  token_type: 'access' | 'refresh'
  payload: jsonb
  created_at: timestamptz
  expires_at: timestamptz
)
```

Public access policies allow anyone to insert, read, and delete token records.

## JWT Token Structure

All generated tokens follow the standard JWT format:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ
```

**Components:**
1. **Header**: Algorithm and type information (Base64URL encoded)
2. **Payload**: Claims and user data (Base64URL encoded)
3. **Signature**: HMAC-SHA256 hash of header + payload (Base64URL encoded)

## Security Notes

- Tokens are generated entirely on the client-side using Web Crypto API
- The secret key is never sent to any server
- Stored tokens in history are for reference only and not authenticated
- Always use strong, random secret keys (32+ characters)
- Refresh tokens have longer expiration for better security
- Enable HTTPS in production to protect token transmission

## Browser Support

The application works on all modern browsers supporting:
- ES2020 JavaScript
- Web Crypto API
- Async/Await
- ES Modules

Tested on:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Troubleshooting

### Tokens not saving to history?
- Verify Supabase environment variables are correctly configured
- Check browser console for any error messages
- Ensure Supabase database is accessible

### Signature verification fails?
- Confirm you're using the exact same secret key used to generate the token
- Check for whitespace or encoding issues in the secret key
- Ensure the token hasn't been modified

### Encoding/decoding errors?
- Verify input format matches the selected encoding scheme
- Check for special characters or encoding issues
- Try decoding the output to verify round-trip conversion

## License

MIT License

## Contributing

Contributions are welcome! Feel free to open issues and submit pull requests.

## Support

For issues, questions, or feature requests, please open an issue on the repository.
