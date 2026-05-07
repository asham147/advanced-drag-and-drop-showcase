import type { Challenge, User, LeaderboardEntry, CTFEvent, Submission, Badge } from '../types';

export const BADGES: Badge[] = [
  { id: 'b1', name: 'First Blood', icon: '🩸', description: 'First to solve a challenge' },
  { id: 'b2', name: 'Crypto Master', icon: '🔐', description: 'Solve 5 crypto challenges' },
  { id: 'b3', name: 'Web Warrior', icon: '🌐', description: 'Solve 5 web challenges' },
  { id: 'b4', name: 'Streak King', icon: '🔥', description: '7-day solve streak' },
  { id: 'b5', name: 'Elite Hacker', icon: '💀', description: 'Reach top 10 on leaderboard' },
  { id: 'b6', name: 'Forensics Pro', icon: '🔬', description: 'Solve 5 forensics challenges' },
  { id: 'b7', name: 'Speed Demon', icon: '⚡', description: 'Solve a challenge in under 2 minutes' },
  { id: 'b8', name: 'Perfectionist', icon: '💎', description: 'Solve all easy challenges' },
];

export const CURRENT_USER: User = {
  id: 'u1',
  username: 'cyberwarrior',
  email: 'warrior@cyberyemen.com',
  role: 'admin',
  avatar: '🛡️',
  bio: 'Cybersecurity enthusiast & CTF player',
  team: 'Yemen Cyber Force',
  country: '🇾🇪',
  joinedAt: '2024-01-15',
  totalScore: 2850,
  solvedCount: 38,
  rank: 3,
  streak: 7,
  badges: [BADGES[0], BADGES[1], BADGES[3], BADGES[6]],
};

export const USERS: User[] = [
  CURRENT_USER,
  { id: 'u2', username: 'shadowbyte', email: 'shadow@cyberyemen.com', role: 'user', avatar: '👤', bio: ' penetration tester', team: 'Darknet Ops', country: '🇾🇪', joinedAt: '2024-02-01', totalScore: 3200, solvedCount: 42, rank: 1, streak: 12, badges: [BADGES[0], BADGES[1], BADGES[2], BADGES[4]] },
  { id: 'u3', username: 'cipherstorm', email: 'cipher@cyberyemen.com', role: 'user', avatar: '🌀', bio: 'Cryptography specialist', team: 'Crypto Knights', country: '🇾🇪', joinedAt: '2024-01-20', totalScore: 2950, solvedCount: 40, rank: 2, streak: 9, badges: [BADGES[1], BADGES[3]] },
  { id: 'u4', username: 'netghost', email: 'ghost@cyberyemen.com', role: 'user', avatar: '👻', bio: 'Network analyst', team: 'Packet Sniffers', country: '🇾🇪', joinedAt: '2024-03-10', totalScore: 2100, solvedCount: 28, rank: 4, streak: 3, badges: [BADGES[5]] },
  { id: 'u5', username: 'binaryninja', email: 'ninja@cyberyemen.com', role: 'moderator', avatar: '🥷', bio: 'Reverse engineering expert', team: 'Malware Hunters', country: '🇾🇪', joinedAt: '2024-01-05', totalScore: 1900, solvedCount: 25, rank: 5, streak: 5, badges: [BADGES[6], BADGES[7]] },
  { id: 'u6', username: 'hexhunter', email: 'hex@cyberyemen.com', role: 'user', avatar: '🔮', bio: 'Forensics specialist', team: 'Digital Detectives', country: '🇾🇪', joinedAt: '2024-02-15', totalScore: 1650, solvedCount: 22, rank: 6, streak: 2, badges: [BADGES[5]] },
  { id: 'u7', username: 'rootaccess', email: 'root@cyberyemen.com', role: 'user', avatar: '🏴', bio: 'Web security researcher', team: 'Zero Day Club', country: '🇾🇪', joinedAt: '2024-04-01', totalScore: 1400, solvedCount: 18, rank: 7, streak: 1, badges: [] },
  { id: 'u8', username: 'pixelphreak', email: 'pixel@cyberyemen.com', role: 'user', avatar: '🎯', bio: 'OSINT specialist', team: 'Open Intel', country: '🇾🇪', joinedAt: '2024-03-20', totalScore: 1100, solvedCount: 15, rank: 8, streak: 0, badges: [] },
];

export const CHALLENGES: Challenge[] = [
  {
    id: 'ch1', title: 'SQL Injection 101', description: `## SQL Injection 101\n\nA vulnerable login page is running on our test server. Your mission is to bypass the authentication and retrieve the hidden flag.\n\n### Objectives\n- Identify the SQL injection vulnerability\n- Craft a payload to bypass authentication\n- Extract the flag from the database\n\n### Hints\n- Try common SQL injection payloads\n- The login form uses a simple SELECT query\n- Think about OR-based injections\n\n\`\`\`sql\nSELECT * FROM users WHERE username = '$user' AND password = '$pass'\n\`\`\``,
    category: 'web', difficulty: 'easy', points: 100, dynamicPoints: false, solves: 156, author: 'cyberwarrior',
    files: [{ id: 'f1', name: 'web_app_source.zip', url: '#', size: '2.4 MB' }],
    hints: ['Try the username field first', "OR 1=1 --"],
    isPrereleased: false, isActive: true, createdAt: '2024-01-20', tags: ['sqli', 'owasp', 'beginner'],
  },
  {
    id: 'ch2', title: 'Caesar\'s Secret', description: `## Caesar's Secret\n\nWe intercepted an encrypted message. The encryption method is ancient but effective.\n\n\`\`\`\nKHOOR ZRUOG{YHFLBHH}\n\`\`\`\n\nDecrypt the message to find the flag.\n\n### Flag Format\n\`CY{decoded_message}\``,
    category: 'crypto', difficulty: 'easy', points: 50, dynamicPoints: false, solves: 234, author: 'cipherstorm',
    files: [], hints: ['Julius Caesar used this cipher', 'The shift is a common number'],
    isPrereleased: false, isActive: true, createdAt: '2024-01-18', tags: ['caesar', 'classical', 'beginner'],
  },
  {
    id: 'ch3', title: 'Packet Detective', description: `## Packet Detective\n\nA network capture file contains suspicious activity. Analyze the pcap file to find the hidden flag.\n\n### Objectives\n- Download and analyze the pcap file\n- Identify the suspicious connection\n- Extract the flag from the network traffic\n\n### Tools Recommended\n- Wireshark\n- tcpdump\n- NetworkMiner`,
    category: 'network', difficulty: 'medium', points: 200, dynamicPoints: false, solves: 89, author: 'netghost',
    files: [{ id: 'f2', name: 'capture.pcap', url: '#', size: '15.8 MB' }],
    hints: ['Look at HTTP requests', 'Check the DNS queries', 'Follow TCP streams'],
    isPrereleased: false, isActive: true, createdAt: '2024-02-05', tags: ['pcap', 'wireshark', 'analysis'],
  },
  {
    id: 'ch4', title: 'Binary Deobfuscation', description: `## Binary Deobfuscation\n\nAn executable file has been obfuscated to hide its true purpose. Reverse engineer the binary to find the flag.\n\n### Objectives\n- Analyze the binary structure\n- Deobfuscate the code\n- Extract the embedded flag\n\n### Tools Recommended\n- Ghidra / IDA Pro\n- radare2\n- GDB`,
    category: 'reversing', difficulty: 'hard', points: 400, dynamicPoints: true, solves: 23, author: 'binaryninja',
    files: [{ id: 'f3', name: 'challenge_binary.elf', url: '#', size: '8.2 MB' }],
    hints: ['Check the .rodata section', 'XOR decryption is used'],
    isPrereleased: false, isActive: true, createdAt: '2024-02-15', tags: ['binary', 'obfuscation', 'advanced'],
  },
  {
    id: 'ch5', title: 'Hidden in Plain Sight', description: `## Hidden in Plain Sight\n\nAn image file contains a hidden message. Use steganography techniques to extract the flag.\n\n### Objectives\n- Download the image file\n- Analyze for hidden data\n- Extract the concealed flag\n\n### Flag Format\n\`CY{steg_hidden_flag}\``,
    category: 'forensics', difficulty: 'easy', points: 75, dynamicPoints: false, solves: 189, author: 'hexhunter',
    files: [{ id: 'f4', name: 'mysterious_image.png', url: '#', size: '3.1 MB' }],
    hints: ['Check LSB encoding', 'steghide is your friend'],
    isPrereleased: false, isActive: true, createdAt: '2024-01-25', tags: ['steganography', 'images', 'beginner'],
  },
  {
    id: 'ch6', title: 'XSS Playground', description: `## XSS Playground\n\nA web application is vulnerable to Cross-Site Scripting. Demonstrate your XSS skills by stealing the admin cookie.\n\n### Objectives\n- Identify the XSS vulnerability\n- Craft a payload to capture cookies\n- Submit the admin cookie as the flag`,
    category: 'web', difficulty: 'medium', points: 250, dynamicPoints: false, solves: 67, author: 'rootaccess',
    files: [], hints: ['Try reflected XSS first', 'document.cookie is your target'],
    isPrereleased: false, isActive: true, createdAt: '2024-02-10', tags: ['xss', 'owasp', 'javascript'],
  },
  {
    id: 'ch7', title: 'RSA Rookie', description: `## RSA Rookie\n\nWe found an RSA key pair with weak parameters. Can you break the encryption?\n\n\`\`\`\nn = 88527181\ne = 65537\nc = 42196616\n\`\`\`\n\nDecrypt the ciphertext and submit the flag as \`CY{plaintext}\``,
    category: 'crypto', difficulty: 'medium', points: 300, dynamicPoints: true, solves: 45, author: 'cipherstorm',
    files: [], hints: ['Factor n to find p and q', 'Use factordb.com or write a script'],
    isPrereleased: false, isActive: true, createdAt: '2024-02-20', tags: ['rsa', 'math', 'number-theory'],
  },
  {
    id: 'ch8', title: 'Memory Forensics', description: `## Memory Forensics\n\nA memory dump from a compromised system has been provided. Analyze it to determine what the attacker did and find the flag.\n\n### Tools\n- Volatility 3\n- MemProcFS`,
    category: 'forensics', difficulty: 'hard', points: 450, dynamicPoints: true, solves: 15, author: 'hexhunter',
    files: [{ id: 'f5', name: 'memory_dump.raw', url: '#', size: '256 MB' }],
    hints: ['Check running processes first', 'Look for suspicious network connections'],
    isPrereleased: false, isActive: true, createdAt: '2024-03-01', tags: ['memory', 'volatility', 'malware'],
  },
  {
    id: 'ch9', title: 'DNS Tunneling', description: `## DNS Tunneling\n\nOur monitoring system captured unusual DNS traffic. Investigate to find exfiltrated data and the flag.`,
    category: 'network', difficulty: 'hard', points: 350, dynamicPoints: false, solves: 28, author: 'netghost',
    files: [{ id: 'f6', name: 'dns_capture.pcap', url: '#', size: '22.1 MB' }],
    hints: ['Look at TXT records', 'Base64 decode the subdomain queries'],
    isPrereleased: false, isActive: true, createdAt: '2024-03-05', tags: ['dns', 'exfiltration', 'tunneling'],
  },
  {
    id: 'ch10', title: 'JWT Forgery', description: `## JWT Forgery\n\nThe API uses JWT tokens for authentication. Find the weakness in the implementation and forge an admin token.\n\n### Flag Format\n\`CY{forged_jwt_claims}\``,
    category: 'web', difficulty: 'hard', points: 500, dynamicPoints: true, solves: 11, author: 'cyberwarrior',
    files: [], hints: ['Check the algorithm used', 'alg: none attack might work'],
    isPrereleased: false, isActive: true, createdAt: '2024-03-10', tags: ['jwt', 'web', 'authentication'],
  },
  {
    id: 'ch11', title: 'Encoder Ring', description: `## Encoder Ring\n\nA message has been encoded multiple times. Decode it layer by layer to reveal the flag.\n\n\`\`\`\n59334{61706q4865717271}\n\`\`\``,
    category: 'misc', difficulty: 'easy', points: 60, dynamicPoints: false, solves: 210, author: 'pixelphreak',
    files: [], hints: ['Multiple encodings stacked', 'Hex → Base64 → ROT13'],
    isPrereleased: false, isActive: true, createdAt: '2024-01-22', tags: ['encoding', 'base64', 'beginner'],
  },
  {
    id: 'ch12', title: 'ROP Chain Reaction', description: `## ROP Chain Reaction\n\nBuild a Return-Oriented Programming chain to bypass NX protections and spawn a shell.`,
    category: 'reversing', difficulty: 'hard', points: 500, dynamicPoints: true, solves: 8, author: 'binaryninja',
    files: [{ id: 'f7', name: 'vulnerable_binary', url: '#', size: '12.4 KB' }],
    hints: ['Use ROPgadget tool', 'Check for /bin/sh string'],
    isPrereleased: false, isActive: true, createdAt: '2024-03-15', tags: ['rop', 'exploitation', 'buffer-overflow'],
  },
];

export const LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, userId: 'u2', username: 'shadowbyte', avatar: '👤', totalScore: 3200, solvedCount: 42, lastSolveAt: '2024-03-15T14:23:00Z', team: 'Darknet Ops', country: '🇾🇪' },
  { rank: 2, userId: 'u3', username: 'cipherstorm', avatar: '🌀', totalScore: 2950, solvedCount: 40, lastSolveAt: '2024-03-15T12:00:00Z', team: 'Crypto Knights', country: '🇾🇪' },
  { rank: 3, userId: 'u1', username: 'cyberwarrior', avatar: '🛡️', totalScore: 2850, solvedCount: 38, lastSolveAt: '2024-03-15T10:45:00Z', team: 'Yemen Cyber Force', country: '🇾🇪' },
  { rank: 4, userId: 'u4', username: 'netghost', avatar: '👻', totalScore: 2100, solvedCount: 28, lastSolveAt: '2024-03-14T18:30:00Z', team: 'Packet Sniffers', country: '🇾🇪' },
  { rank: 5, userId: 'u5', username: 'binaryninja', avatar: '🥷', totalScore: 1900, solvedCount: 25, lastSolveAt: '2024-03-14T15:20:00Z', team: 'Malware Hunters', country: '🇾🇪' },
  { rank: 6, userId: 'u6', username: 'hexhunter', avatar: '🔮', totalScore: 1650, solvedCount: 22, lastSolveAt: '2024-03-13T22:10:00Z', team: 'Digital Detectives', country: '🇾🇪' },
  { rank: 7, userId: 'u7', username: 'rootaccess', avatar: '🏴', totalScore: 1400, solvedCount: 18, lastSolveAt: '2024-03-13T09:00:00Z', team: 'Zero Day Club', country: '🇾🇪' },
  { rank: 8, userId: 'u8', username: 'pixelphreak', avatar: '🎯', totalScore: 1100, solvedCount: 15, lastSolveAt: '2024-03-12T20:45:00Z', team: 'Open Intel', country: '🇾🇪' },
  { rank: 9, userId: 'u9', username: 'zerocool', avatar: '😎', totalScore: 950, solvedCount: 13, lastSolveAt: '2024-03-12T16:30:00Z', team: 'Hack The Planet', country: '🇾🇪' },
  { rank: 10, userId: 'u10', username: 'bytecrusher', avatar: '🤖', totalScore: 800, solvedCount: 10, lastSolveAt: '2024-03-11T14:00:00Z', team: 'Byte Bandits', country: '🇾🇪' },
];

export const EVENTS: CTFEvent[] = [
  { id: 'e1', name: 'CyberYemen Season 1', description: 'First official CTF competition', startDate: '2024-04-01', endDate: '2024-04-03', status: 'upcoming', participants: 128, challenges: 20, prizePool: '$500' },
  { id: 'e2', name: 'Ramadan Hack Night', description: 'Overnight hacking challenge during Ramadan', startDate: '2024-03-20', endDate: '2024-03-21', status: 'active', participants: 64, challenges: 12, prizePool: '$200' },
  { id: 'e3', name: 'Beginner Bootcamp CTF', description: 'Training event for newcomers', startDate: '2024-02-10', endDate: '2024-02-12', status: 'ended', participants: 256, challenges: 15, prizePool: 'Free' },
];

export const SOLVED_CHALLENGES: string[] = ['ch1', 'ch2', 'ch5', 'ch6', 'ch11'];

export const MOCK_SUBMISSIONS: Submission[] = [
  { id: 's1', userId: 'u1', challengeId: 'ch1', flag: 'CY{sql_injection_master}', correct: true, submittedAt: '2024-03-10T14:30:00Z' },
  { id: 's2', userId: 'u1', challengeId: 'ch2', flag: 'CY{hello_world_veteran}', correct: true, submittedAt: '2024-03-10T15:00:00Z' },
  { id: 's3', userId: 'u1', challengeId: 'ch3', flag: 'CY{wrong_flag}', correct: false, submittedAt: '2024-03-11T09:00:00Z' },
  { id: 's4', userId: 'u1', challengeId: 'ch5', flag: 'CY{steg_hidden_flag}', correct: true, submittedAt: '2024-03-11T10:30:00Z' },
  { id: 's5', userId: 'u1', challengeId: 'ch6', flag: 'CY{xss_cookie_steal}', correct: true, submittedAt: '2024-03-12T14:00:00Z' },
  { id: 's6', userId: 'u1', challengeId: 'ch11', flag: 'CY{layer_by_layer}', correct: true, submittedAt: '2024-03-12T16:00:00Z' },
];

export const FLAG_MAP: Record<string, string> = {
  ch1: 'CY{sql_injection_master}',
  ch2: 'CY{hello_world_veteran}',
  ch3: 'CY{packet_analysis_pro}',
  ch4: 'CY{binary_ninja_unleashed}',
  ch5: 'CY{steg_hidden_flag}',
  ch6: 'CY{xss_cookie_steal}',
  ch7: 'CY{rsa_factor_king}',
  ch8: 'CY{memory_forensics_expert}',
  ch9: 'CY{dns_tunnel_hunter}',
  ch10: 'CY{jwt_none_attack}',
  ch11: 'CY{layer_by_layer}',
  ch12: 'CY{rop_chain_master}',
};
