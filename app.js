// ============================================================================
// HỆ THỐNG KIỂM TRA TRỰC TUYẾN TOÁN 10 - ĐỀ SỐ 01 (GIỮA HỌC KÌ 1)
// Học sinh làm bài và KHÔNG XEM ĐƯỢC ĐIỂM. Chỉ Giáo viên có mật khẩu mới xem được.
// ============================================================================

const STORAGE_KEYS = {
  SUBMISSIONS: 'math10_exam01_submissions_v1',
  SETTINGS: 'math10_exam01_settings_v1',
  ATTACHED_FILE: 'math10_exam01_attached_file_v1'
};

// Mật khẩu mặc định của Giáo viên: giaovien123
let appSettings = {
  durationMinutes: 90,
  teacherPassword: 'giaovien123',
  cloudRoomId: 'TOAN10_DE01_GV_ROOM_9871',
  maxTabSwitches: 3
};

const SECRET_CIPHER_KEY = 'GV_TOAN10_SECRET_KEY_2026';
let lastSubmittedRecord = null;

// SVG Hình vẽ cho các câu có hình trong đề
const SVG_FIGURES = {
  part1_q6: `
    <svg viewBox="0 0 420 70" width="100%" height="70" xmlns="http://www.w3.org/2000/svg">
      <line x1="20" y1="32" x2="395" y2="32" stroke="#1e293b" stroke-width="2"/>
      <polygon points="400,32 390,26 390,38" fill="#1e293b"/>
      <!-- Gạch chéo bên trái -2 -->
      <g stroke="#1e293b" stroke-width="1.8">
        <line x1="35" y1="42" x2="48" y2="22"/>
        <line x1="50" y1="42" x2="63" y2="22"/>
        <line x1="65" y1="42" x2="78" y2="22"/>
        <line x1="80" y1="42" x2="93" y2="22"/>
        <line x1="95" y1="42" x2="108" y2="22"/>
        <line x1="110" y1="42" x2="123" y2="22"/>
        <line x1="125" y1="42" x2="138" y2="22"/>
        <!-- Gạch chéo bên phải 3 -->
        <line x1="275" y1="42" x2="288" y2="22"/>
        <line x1="290" y1="42" x2="303" y2="22"/>
        <line x1="305" y1="42" x2="318" y2="22"/>
        <line x1="320" y1="42" x2="333" y2="22"/>
        <line x1="335" y1="42" x2="348" y2="22"/>
        <line x1="350" y1="42" x2="363" y2="22"/>
        <line x1="365" y1="42" x2="378" y2="22"/>
      </g>
      <!-- Ngoặc tròn tại -2 và ngoặc vuông tại 3 -->
      <path d="M 152,18 Q 140,32 152,46" fill="none" stroke="#1e293b" stroke-width="2.5"/>
      <path d="M 262,18 L 270,18 L 270,46 L 262,46" fill="none" stroke="#1e293b" stroke-width="2.5"/>
      <text x="135" y="64" font-size="16" font-family="serif" fill="#1e293b">-2</text>
      <text x="265" y="64" font-size="16" font-family="serif" fill="#1e293b">3</text>
    </svg>
  `,
  part3_q3: `
    <svg viewBox="0 0 380 210" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">
      <!-- Đoạn AB = 4m, trung điểm D -->
      <line x1="60" y1="175" x2="320" y2="175" stroke="#1d4ed8" stroke-width="2.5"/>
      <!-- Đoạn AF và DF -->
      <line x1="60" y1="175" x2="145" y2="35" stroke="#1d4ed8" stroke-width="2.2"/>
      <line x1="145" y1="35" x2="190" y2="175" stroke="#1d4ed8" stroke-width="2.2"/>
      <!-- Cung tròn (C) đi qua A, E, B -->
      <path d="M 60,175 Q 190,42 320,175" fill="none" stroke="#15803d" stroke-width="2.5"/>
      <!-- Góc DAF = 60 độ -->
      <path d="M 88,175 A 28,28 0 0,0 74,151" fill="none" stroke="#b91c1c" stroke-width="1.8"/>
      <!-- Ký hiệu trung điểm AD = DB -->
      <line x1="122" y1="170" x2="128" y2="180" stroke="#b91c1c" stroke-width="2"/>
      <line x1="252" y1="170" x2="258" y2="180" stroke="#b91c1c" stroke-width="2"/>
      <!-- Các điểm A, B, D, F, E -->
      <circle cx="60" cy="175" r="3.5" fill="#1e293b"/>
      <circle cx="320" cy="175" r="3.5" fill="#1e293b"/>
      <circle cx="190" cy="175" r="3.5" fill="#1e293b"/>
      <circle cx="145" cy="35" r="3.5" fill="#1e293b"/>
      <circle cx="167.5" cy="105" r="3.5" fill="#1e293b"/>
      <!-- Nhãn -->
      <text x="42" y="185" font-weight="bold" font-style="italic" font-size="15">A</text>
      <text x="328" y="185" font-weight="bold" font-style="italic" font-size="15">B</text>
      <text x="185" y="195" font-weight="bold" font-style="italic" font-size="15">D</text>
      <text x="140" y="25" font-weight="bold" font-style="italic" font-size="15">F</text>
      <text x="174" y="102" font-weight="bold" font-style="italic" font-size="15">E</text>
      <text x="162" y="72" font-weight="bold" font-size="14" fill="#1e293b">1m</text>
      <text x="260" y="112" font-weight="bold" font-style="italic" font-size="15" fill="#15803d">(C)</text>
    </svg>
  `,
  part3_q4: `
    <svg viewBox="0 0 380 200" width="100%" height="190" xmlns="http://www.w3.org/2000/svg">
      <!-- Hai hướng tàu chạy từ A -->
      <line x1="65" y1="165" x2="180" y2="50" stroke="#1e293b" stroke-width="2.2"/>
      <line x1="65" y1="165" x2="305" y2="165" stroke="#1e293b" stroke-width="2.2"/>
      <!-- Góc 60 độ tại A -->
      <path d="M 98,165 A 33,33 0 0,0 88,142" fill="none" stroke="#1e293b" stroke-width="1.6"/>
      <text x="98" y="154" font-size="14">60°</text>
      <!-- Tàu C -->
      <g transform="translate(150, 15)">
        <polygon points="10,30 50,30 42,40 18,40" fill="#facc15" stroke="#1e293b" stroke-width="1.5"/>
        <polygon points="30,2 30,28 46,28" fill="#f87171" stroke="#1e293b" stroke-width="1.2"/>
        <polygon points="28,6 28,28 14,28" fill="#60a5fa" stroke="#1e293b" stroke-width="1.2"/>
      </g>
      <!-- Tàu B -->
      <g transform="translate(265, 122)">
        <polygon points="10,30 55,30 46,42 18,42" fill="#facc15" stroke="#1e293b" stroke-width="1.5"/>
        <polygon points="32,0 32,28 50,28" fill="#f87171" stroke="#1e293b" stroke-width="1.2"/>
        <polygon points="30,5 30,28 15,28" fill="#4ade80" stroke="#1e293b" stroke-width="1.2"/>
      </g>
      <text x="48" y="172" font-weight="bold" font-style="italic" font-size="15">A</text>
      <text x="175" y="72" font-weight="bold" font-style="italic" font-size="15">C</text>
      <text x="292" y="184" font-weight="bold" font-style="italic" font-size="15">B</text>
    </svg>
  `
};

// DỮ LIỆU ĐỀ THI SỐ 01 & ĐÁP ÁN CHI TIẾT (CHỈ HIỂN THỊ CHO GIÁO VIÊN)
const EXAM_DATA = {
  // PHẦN I: 12 câu trắc nghiệm 4 lựa chọn (Mỗi câu 0.25 điểm = 3.0 điểm)
  part1: [
    {
      id: 'p1_q1',
      num: 1,
      text: 'Trong các câu sau, câu nào là mệnh đề?',
      options: {
        A: 'Bạn cao bao nhiêu?',
        B: 'Hôm nay là thứ mấy?',
        C: 'Việt Nam giáp Trung Quốc.',
        D: 'Con học bài đi!'
      },
      answer: 'C',
      explanation: 'Câu "Việt Nam giáp Trung Quốc" là câu khẳng định có tính đúng/sai (đây là mệnh đề đúng). Các câu A, B là câu hỏi; câu D là câu cầu khiến nên không phải là mệnh đề.'
    },
    {
      id: 'p1_q2',
      num: 2,
      text: 'Cho mệnh đề chứa biến \\(P(n): \\text{"}n+1 \\text{ chia hết cho } 4\\text{"}\\). Mệnh đề nào dưới đây đúng?',
      options: {
        A: '\\(P(1)\\).',
        B: '\\(P(4)\\).',
        C: '\\(P(6)\\).',
        D: '\\(P(7)\\).'
      },
      answer: 'D',
      explanation: 'Thay \\(n = 7\\) ta có \\(7 + 1 = 8\\) chia hết cho \\(4\\), nên \\(P(7)\\) là mệnh đề đúng.'
    },
    {
      id: 'p1_q3',
      num: 3,
      text: 'Mệnh đề nào sau đây là mệnh đề <strong>sai</strong>?',
      options: {
        A: '\\(\\text{"}\\forall x \\in \\mathbb{R} : x^2 > 0\\text{"}\\).',
        B: '\\(\\text{"}\\exists n \\in \\mathbb{N} : n = n^2\\text{"}\\).',
        C: '\\(\\text{"}\\exists n \\in \\mathbb{N} : n \\le 2n\\text{"}\\).',
        D: '\\(\\text{"}\\exists x \\in \\mathbb{R} : x > x^2\\text{"}\\).'
      },
      answer: 'A',
      explanation: 'Với \\(x = 0 \\in \\mathbb{R}\\) thì \\(x^2 = 0\\) (không lớn hơn 0), nên mệnh đề \\(\\forall x \\in \\mathbb{R} : x^2 > 0\\) là mệnh đề sai.'
    },
    {
      id: 'p1_q4',
      num: 4,
      text: 'Cho mệnh đề \\(P\\): “Nếu \\(a\\) và \\(b\\) chia hết cho \\(3\\) thì \\(a+b\\) cũng chia hết cho \\(3\\)”. Mệnh đề nào là mệnh đề đảo của mệnh đề \\(P\\)?',
      options: {
        A: 'Nếu \\(a+b\\) chia hết cho \\(3\\) thì \\(a\\) chia hết cho \\(3\\).',
        B: 'Nếu \\(a+b\\) chia hết cho \\(3\\) thì \\(b\\) chia hết cho \\(3\\).',
        C: 'Nếu \\(a\\) và \\(b\\) không chia hết cho \\(3\\) thì \\(a+b\\) cũng không chia hết cho \\(3\\).',
        D: 'Nếu \\(a+b\\) chia hết cho \\(3\\) thì \\(a\\) và \\(b\\) chia hết cho \\(3\\).'
      },
      answer: 'D',
      explanation: 'Mệnh đề đảo của mệnh đề \\(A \\Rightarrow B\\) là \\(B \\Rightarrow A\\): “Nếu \\(a+b\\) chia hết cho 3 thì \\(a\\) và \\(b\\) chia hết cho 3”.'
    },
    {
      id: 'p1_q5',
      num: 5,
      text: 'Phát biểu nào sau đây là mệnh đề?',
      options: {
        A: 'Trời mưa to quá!',
        B: 'Lan có thích uống trà sữa không?',
        C: 'Bão Yagi lớn quá!',
        D: 'Hà Giang là một tỉnh miền núi phía bắc của Việt Nam.'
      },
      answer: 'D',
      explanation: '“Hà Giang là một tỉnh miền núi phía bắc của Việt Nam” là một khẳng định đúng, do đó là mệnh đề.'
    },
    {
      id: 'p1_q6',
      num: 6,
      text: 'Hình vẽ bên biểu diễn cho tập hợp nào trên trục số?',
      figure: SVG_FIGURES.part1_q6,
      options: {
        A: '\\([-2; 3]\\).',
        B: '\\((-2; 3]\\).',
        C: '\\([-2; 3)\\).',
        D: '\\((-2; 3)\\).'
      },
      answer: 'B',
      explanation: 'Trên trục số, phần không bị gạch giới hạn từ \\(-2\\) (ngoặc tròn) đến \\(3\\) (ngoặc vuông), biểu diễn nửa khoảng \\((-2; 3]\\).'
    },
    {
      id: 'p1_q7',
      num: 7,
      text: 'Cho ba tập hợp \\(A = \\{x \\in \\mathbb{R} \\mid x^2 - 4x + 3 = 0\\}\\), \\(B = \\{x \\in \\mathbb{Z} \\mid -3 < 2x < 4\\}\\), \\(C = \\{x \\in \\mathbb{N} \\mid x^5 - x^4 = 0\\}\\) khẳng định nào sau đây <strong>sai</strong>?',
      options: {
        A: '\\(A \\cup B = \\{-1; 0; 1; 3\\}\\).',
        B: '\\(A \\cap B \\cap C = \\{1\\}\\).',
        C: '\\(A \\cap B = \\{1\\}\\).',
        D: '\\(B \\cup C = \\{0; 1\\}\\).'
      },
      answer: 'D',
      explanation: 'Ta có \\(A = \\{1; 3\\}\\), \\(B = \\{-1; 0; 1\\}\\), \\(C = \\{0; 1\\}\\). Khi đó \\(B \\cup C = \\{-1; 0; 1\\} \\ne \\{0; 1\\}\\), nên khẳng định D sai.'
    },
    {
      id: 'p1_q8',
      num: 8,
      text: 'Cho hai tập hợp \\(A = \\{1; 2; 5; 6\\}\\), \\(B = \\{1; 2; 3; 4; 5; 6; 7; 8\\}\\) khi đó tập \\(C_B A\\) là:',
      options: {
        A: '\\(\\{1; 2; 4; 6\\}\\).',
        B: '\\(\\{4; 6\\}\\).',
        C: '\\(\\{3; 4; 7; 8\\}\\).',
        D: '\\(\\{2; 6; 7; 8\\}\\).'
      },
      answer: 'C',
      explanation: 'Phần bù của \\(A\\) trong \\(B\\) là \\(C_B A = B \\setminus A = \\{3; 4; 7; 8\\}\\).'
    },
    {
      id: 'p1_q9',
      num: 9,
      text: 'Cho tam giác \\(ABC\\), biết \\(AB = 3, AC = 5, BC = 7\\). Tính góc \\(BAC\\) của tam giác \\(ABC\\)?',
      options: {
        A: '\\(\\widehat{BAC} = 120^\\circ\\).',
        B: '\\(\\widehat{BAC} = 60^\\circ\\).',
        C: '\\(\\widehat{BAC} = 150^\\circ\\).',
        D: '\\(\\widehat{BAC} = 90^\\circ\\).'
      },
      answer: 'A',
      explanation: 'Áp dụng định lý côsin: \\(\\cos A = \\frac{AB^2 + AC^2 - BC^2}{2 \\cdot AB \\cdot AC} = \\frac{3^2 + 5^2 - 7^2}{2 \\cdot 3 \\cdot 5} = \\frac{-15}{30} = -\\frac{1}{2} \\Rightarrow \\widehat{BAC} = 120^\\circ\\).'
    },
    {
      id: 'p1_q10',
      num: 10,
      text: 'Cho tam giác \\(ABC\\) có \\(AB = c, AC = b\\) và góc \\(A\\). Diện tích \\(S\\) của tam giác \\(ABC\\) được tính theo công thức nào sau đây?',
      options: {
        A: '\\(S = bc \\sin A\\).',
        B: '\\(S = \\frac{1}{2} bc \\cos A\\).',
        C: '\\(S = bc \\cos A\\).',
        D: '\\(S = \\frac{1}{2} bc \\sin A\\).'
      },
      answer: 'D',
      explanation: 'Công thức tính diện tích tam giác theo hai cạnh và góc xen giữa: \\(S = \\frac{1}{2} bc \\sin A\\).'
    },
    {
      id: 'p1_q11',
      num: 11,
      text: 'Cho bất phương trình: \\(2x - y \\le 3\\). Miền nghiệm của bất phương trình trong mặt phẳng tọa độ \\(Oxy\\) là:',
      options: {
        A: 'Nửa mặt phẳng chứa điểm \\(O\\) có bờ là đường thẳng \\(2x - y = 3\\) (không kể bờ).',
        B: 'Nửa mặt phẳng không chứa điểm \\(O\\) có bờ là đường thẳng \\(2x - y = 3\\) (không kể bờ).',
        C: 'Nửa mặt phẳng chứa điểm \\(O\\) có bờ là đường thẳng \\(2x - y = 3\\) (kể cả bờ).',
        D: 'Nửa mặt phẳng không chứa điểm \\(O\\) có bờ là đường thẳng \\(2x - y = 3\\) (kể cả bờ).'
      },
      answer: 'C',
      explanation: 'Thay tọa độ \\(O(0; 0)\\) vào bất phương trình: \\(2(0) - 0 = 0 \\le 3\\) (đúng) và bất phương trình có dấu \\(\\le\\) nên miền nghiệm là nửa mặt phẳng chứa điểm \\(O\\) có bờ \\(2x - y = 3\\) (kể cả bờ).'
    },
    {
      id: 'p1_q12',
      num: 12,
      text: 'Cặp số \\((x; y)\\) nào sau đây là nghiệm của hệ bất phương trình \\(\\begin{cases} 2x + 3y - 1 > 0 \\\\ 5x - y + 4 \\le 0 \\end{cases}\\) là:',
      options: {
        A: '\\((0; 0)\\).',
        B: '\\((-2; -4)\\).',
        C: '\\((-3; -4)\\).',
        D: '\\((0; 4)\\).'
      },
      answer: 'D',
      explanation: 'Thay \\((0; 4)\\) vào hệ: \\(2(0) + 3(4) - 1 = 11 > 0\\) (đúng) và \\(5(0) - 4 + 4 = 0 \\le 0\\) (đúng).'
    }
  ],

  // PHẦN II: 4 câu trắc nghiệm Đúng/Sai (Mỗi câu tối đa 1.0 điểm: đúng 1 ý 0.1đ, 2 ý 0.25đ, 3 ý 0.5đ, 4 ý 1.0đ)
  part2: [
    {
      id: 'p2_q1',
      num: 1,
      text: 'Cho các tập hợp sau: \\(A\\) là tập các số nguyên tố nhỏ hơn \\(11\\); \\(B = \\{x \\in \\mathbb{R} \\mid x^2 - 5x + 6 = 0\\}\\). Xét tính đúng sai của các mệnh đề sau:',
      statements: [
        { key: 'a', text: 'a) Tập hợp \\(A\\) có 4 phần tử.', answer: true },
        { key: 'b', text: 'b) Tập hợp \\(B\\) có 3 tập con.', answer: false },
        { key: 'c', text: 'c) \\(B \\subset A\\).', answer: true },
        { key: 'd', text: 'd) Có 4 tập hợp \\(X\\) thoả mãn \\(B \\subset X \\subset A\\).', answer: true }
      ],
      explanation: `
        • \\(A = \\{2; 3; 5; 7\\}\\) có 4 phần tử \\(\\Rightarrow\\) a) <strong>Đúng</strong>.<br/>
        • \\(B = \\{2; 3\\}\\) có \\(2^2 = 4\\) tập con \\(\\Rightarrow\\) b) <strong>Sai</strong>.<br/>
        • Vì mọi phần tử của \\(B\\) đều thuộc \\(A\\) nên \\(B \\subset A \\Rightarrow\\) c) <strong>Đúng</strong>.<br/>
        • Các tập \\(X\\) thỏa mãn \\(\\{2; 3\\} \\subset X \\subset \\{2; 3; 5; 7\\}\\) là: \\(\\{2;3\\}, \\{2;3;5\\}, \\{2;3;7\\}, \\{2;3;5;7\\}\\) (có 4 tập hợp) \\(\\Rightarrow\\) d) <strong>Đúng</strong>.
      `
    },
    {
      id: 'p2_q2',
      num: 2,
      text: 'Cho biểu thức \\(P(n) = 3n^2 + 3n - 6\\) với \\(n \\in \\mathbb{N}\\). Xét tính đúng sai của các mệnh đề sau:',
      statements: [
        { key: 'a', text: 'a) \\(P(3)\\) có giá trị là số lẻ.', answer: false },
        { key: 'b', text: 'b) \\(P(4) + 1\\) có giá trị là số nguyên tố.', answer: false },
        { key: 'c', text: 'c) \\(P(7n) < P(n) + 2025\\) với \\(n = 3\\).', answer: true },
        { key: 'd', text: 'd) Tồn tại số tự nhiên \\(n\\) để biểu thức \\(\\dfrac{P(n)+1}{n+2}\\) có giá trị nguyên.', answer: false }
      ],
      explanation: `
        • \\(P(3) = 3 \\cdot 3^2 + 3 \\cdot 3 - 6 = 30\\) là số chẵn \\(\\Rightarrow\\) a) <strong>Sai</strong>.<br/>
        • \\(P(4) + 1 = 3 \\cdot 4^2 + 3 \\cdot 4 - 6 + 1 = 55\\) chia hết cho 5 nên không là số nguyên tố \\(\\Rightarrow\\) b) <strong>Sai</strong>.<br/>
        • Với \\(n = 3\\): \\(P(21) = 3 \\cdot 21^2 + 3 \\cdot 21 - 6 = 1380\\), còn \\(P(3) + 2025 = 30 + 2025 = 2055\\). Ta có \\(1380 < 2055 \\Rightarrow\\) c) <strong>Đúng</strong>.<br/>
        • \\(\\dfrac{P(n)+1}{n+2} = \\dfrac{3n^2+3n-5}{n+2} = 3(n-1) + \\dfrac{1}{n+2}\\). Vì \\(n \\in \\mathbb{N}\\) nên \\(n + 2 \\ge 2\\), suy ra \\(\\dfrac{1}{n+2}\\) không nguyên với mọi \\(n \\in \\mathbb{N} \\Rightarrow\\) d) <strong>Sai</strong>.
      `
    },
    {
      id: 'p2_q3',
      num: 3,
      text: 'Cho tam giác \\(ABC\\) có \\(AC = 8, BC = 12, \\widehat{ACB} = 60^\\circ\\), \\(R\\) là bán kính đường tròn ngoại tiếp tam giác \\(ABC\\). Xét tính đúng sai của các mệnh đề sau:',
      statements: [
        { key: 'a', text: 'a) \\(\\dfrac{\\sin A}{BC} = \\dfrac{\\sin B}{AC} = \\dfrac{\\sin C}{AB} = 2R\\).', answer: false },
        { key: 'b', text: 'b) \\(AB = 4\\sqrt{7}\\).', answer: true },
        { key: 'c', text: 'c) Diện tích tam giác \\(ABC\\) là \\(S = 24\\).', answer: false },
        { key: 'd', text: 'd) Gọi \\(M\\) là trung điểm \\(AB\\). Độ dài \\(MC\\) bằng \\(2\\sqrt{19}\\).', answer: true }
      ],
      explanation: `
        • Theo định lý sin: \\(\\dfrac{BC}{\\sin A} = \\dfrac{AC}{\\sin B} = \\dfrac{AB}{\\sin C} = 2R\\) nên \\(\\dfrac{\\sin A}{BC} = \\dfrac{1}{2R} \\Rightarrow\\) a) <strong>Sai</strong>.<br/>
        • \\(AB^2 = AC^2 + BC^2 - 2 \\cdot AC \\cdot BC \\cdot \\cos 60^\\circ = 8^2 + 12^2 - 2 \\cdot 8 \\cdot 12 \\cdot \\frac{1}{2} = 112 \\Rightarrow AB = 4\\sqrt{7} \\Rightarrow\\) b) <strong>Đúng</strong>.<br/>
        • \\(S = \\frac{1}{2} AC \\cdot BC \\cdot \\sin 60^\\circ = \\frac{1}{2} \\cdot 8 \\cdot 12 \\cdot \\frac{\\sqrt{3}}{2} = 24\\sqrt{3} \\ne 24 \\Rightarrow\\) c) <strong>Sai</strong>.<br/>
        • Đường trung tuyến: \\(MC^2 = \\dfrac{2(AC^2 + BC^2) - AB^2}{4} = \\dfrac{2(64 + 144) - 112}{4} = 76 \\Rightarrow MC = \\sqrt{76} = 2\\sqrt{19} \\Rightarrow\\) d) <strong>Đúng</strong>.
      `
    },
    {
      id: 'p2_q4',
      num: 4,
      text: 'Một cửa hàng bán hai loại gạo là gạo sữa và gạo lứt. Gạo sữa giá 15 nghìn đồng/kg. Gạo lứt giá 25 nghìn đồng/kg. Xét tính đúng sai của các mệnh đề sau:',
      statements: [
        { key: 'a', text: 'a) Cửa hàng bán \\(x\\) kg gạo sữa được số tiền là \\(15x\\) (nghìn đồng).', answer: true },
        { key: 'b', text: 'b) Cửa hàng trộn \\(x\\) kg gạo sữa và \\(y\\) kg gạo lứt và bán số gạo đã trộn với giá 20 nghìn đồng/kg thì số tiền thu được là \\(T = 20(x+y)\\) (nghìn đồng).', answer: true },
        { key: 'c', text: 'c) Cửa hàng trộn \\(x\\) kg gạo sữa và \\(y\\) kg gạo lứt sao cho số gạo đã trộn có giá không quá 20 nghìn đồng/kg. Khi đó bất phương trình biểu thị mối liên hệ giữa \\(x\\) và \\(y\\) là \\(3x - 5y \\ge 0\\).', answer: false },
        { key: 'd', text: 'd) Cửa hàng trộn \\(x\\) kg gạo sữa và \\(y\\) kg gạo lứt sao cho số gạo đã trộn có giá không quá 20 nghìn đồng/kg. Nếu trộn không quá 10 kg gạo sữa thì số tiền thu được tối đa là 240 nghìn đồng.', answer: false }
      ],
      explanation: `
        • Bán \\(x\\) kg gạo sữa giá 15 nghìn/kg thu được \\(15x\\) nghìn đồng \\(\\Rightarrow\\) a) <strong>Đúng</strong>.<br/>
        • Tổng khối lượng gạo trộn là \\((x+y)\\) kg, bán giá 20 nghìn đồng/kg thu được \\(T = 20(x+y)\\) nghìn đồng \\(\\Rightarrow\\) b) <strong>Đúng</strong>.<br/>
        • Giá mỗi kg gạo trộn không quá 20 nghìn đồng: \\(\\dfrac{15x + 25y}{x+y} \\le 20 \\Leftrightarrow 15x + 25y \\le 20x + 20y \\Leftrightarrow x - y \\ge 0\\) (không phải \\(3x - 5y \\ge 0\\)) \\(\\Rightarrow\\) c) <strong>Sai</strong>.<br/>
        • Với \\(0 \\le x \\le 10\\) và \\(y \\le x\\), khi \\(x = 10, y = 10\\) thì số tiền tối đa thu được là \\(15(10) + 25(10) = 400\\) nghìn đồng (khác 240 nghìn đồng) \\(\\Rightarrow\\) d) <strong>Sai</strong>.
      `
    }
  ],

  // PHẦN III: 4 câu trắc nghiệm trả lời ngắn (Mỗi câu 0.5 điểm = 2.0 điểm)
  part3: [
    {
      id: 'p3_q1',
      num: 1,
      text: 'Cho phát biểu \\(\\forall x \\in \\mathbb{R}, x^2 + a - 5 > 0\\) với \\(a\\) là số thực cho trước. Có bao nhiêu giá trị nguyên của tham số \\(a < 20\\) để phát biểu đã cho là mệnh đề đúng?',
      acceptedAnswers: ['14'],
      displayAnswer: '14',
      explanation: 'Vì \\(x^2 \\ge 0, \\forall x \\in \\mathbb{R}\\) nên \\(x^2 + a - 5 > 0, \\forall x \\in \\mathbb{R} \\Leftrightarrow a - 5 > 0 \\Leftrightarrow a > 5\\). Kết hợp \\(a \\in \\mathbb{Z}, a < 20 \\Rightarrow a \\in \\{6; 7; \\dots; 19\\}\\), có \\(19 - 6 + 1 = 14\\) giá trị nguyên.'
    },
    {
      id: 'p3_q2',
      num: 2,
      text: 'Cho hai tập hợp \\(A = (m-1; 8]\\); \\(B = (2; 16-m)\\), \\(m \\in \\mathbb{R}\\). Có bao nhiêu số nguyên \\(m\\) để \\(A \\setminus B = \\varnothing\\)?',
      acceptedAnswers: ['5'],
      displayAnswer: '5',
      explanation: 'Với điều kiện tập hợp \\(m - 1 < 8 \\Leftrightarrow m < 9\\), để \\(A \\setminus B = \\varnothing \\Leftrightarrow A \\subset B \\Leftrightarrow \\begin{cases} m - 1 \\ge 2 \\\\ 16 - m > 8 \\end{cases} \\Leftrightarrow 3 \\le m < 8\\). Vì \\(m \\in \\mathbb{Z}\\) nên \\(m \\in \\{3; 4; 5; 6; 7\\}\\), có 5 số nguyên.'
    },
    {
      id: 'p3_q3',
      num: 3,
      text: 'Mặt tiền nhà ông An có chiều ngang \\(AB = 4\\text{m}\\), ông An muốn thiết kế lan can nhô ra có dạng là một phần của đường tròn \\((C)\\) (hình vẽ). Vì phía trước vướng cây tại vị trí \\(F\\) nên để an toàn, ông An cho xây đường cong cách \\(1\\text{m}\\) tính từ trung điểm \\(D\\) của \\(AB\\). Biết \\(AF = 2\\text{m}, \\widehat{DAF} = 60^\\circ\\) và lan can cao \\(1\\text{m}\\) làm bằng inox với giá \\(2,2\\text{ triệu/m}^2\\). Tính số tiền ông An phải trả theo đơn vị triệu đồng <em>(làm tròn đến chữ số thập phân thứ hai)</em>.',
      figure: SVG_FIGURES.part3_q3,
      acceptedAnswers: ['9,99', '9.99'],
      displayAnswer: '9,99',
      explanation: 'Ta có \\(D\\) là trung điểm \\(AB \\Rightarrow AD = DB = 2\\text{m}\\). Vì \\(AF = AD = 2\\text{m}\\) và \\(\\widehat{DAF} = 60^\\circ\\) nên \\(\\triangle ADF\\) đều cạnh \\(2\\text{m} \\Rightarrow DF = 2\\text{m}\\), điểm \\(E\\) là trung điểm \\(DF\\) (\\(ED = EF = 1\\text{m}\\)), \\(AE = \\sqrt{3}\\text{m}\\). Trong \\(\\triangle EDB\\) có \\(ED = 1, DB = 2, \\widehat{EDB} = 120^\\circ \\Rightarrow EB = \\sqrt{7}\\text{m}\\). Trong \\(\\triangle AEB\\): \\(\\cos \\widehat{AEB} = -\\frac{\\sqrt{3}}{\\sqrt{7}} \\Rightarrow \\sin \\widehat{AEB} = \\frac{2}{\\sqrt{7}}\\). Bán kính đường tròn \\((C)\\) là \\(R = \\frac{AB}{2\\sin\\widehat{AEB}} = \\sqrt{7}\\text{m}\\), góc ở tâm chắn cung \\(AEB\\) là \\(\\alpha = 2\\arcsin\\left(\\frac{2}{\\sqrt{7}}\\right) \\approx 1,7157\\text{ rad}\\). Độ dài cung \\(l = R\\alpha \\approx 4,5393\\text{m}\\). Số tiền phải trả: \\(4,5393 \\times 1 \\times 2,2 \\approx 9,99\\) (triệu đồng).'
    },
    {
      id: 'p3_q4',
      num: 4,
      text: 'Hai chiếc tàu thủy cùng xuất phát từ vị trí \\(A\\), đi thẳng theo hai hướng hợp với nhau một góc \\(60^\\circ\\). Tàu thứ nhất chạy với tốc độ \\(30\\text{km/h}\\), tàu thứ hai chạy với tốc độ \\(40\\text{km/h}\\). Hỏi sau 2 giờ hai tàu cách nhau bao nhiêu ki-lô-mét? <em>(làm tròn đến chữ số thập phân thứ nhất)</em>.',
      figure: SVG_FIGURES.part3_q4,
      acceptedAnswers: ['72,1', '72.1'],
      displayAnswer: '72,1',
      explanation: 'Sau 2 giờ, quãng đường hai tàu đi được là \\(AC = 30 \\times 2 = 60\\text{ km}\\) và \\(AB = 40 \\times 2 = 80\\text{ km}\\). Áp dụng định lý côsin trong \\(\\triangle ABC\\): \\(BC = \\sqrt{60^2 + 80^2 - 2 \\cdot 60 \\cdot 80 \\cdot \\cos 60^\\circ} = \\sqrt{5200} = 20\\sqrt{13} \\approx 72,1\\text{ (km)}\\).'
    }
  ],

  // PHẦN IV: 2 câu Tự luận (Mỗi câu 0.5 điểm = 1.0 điểm)
  part4: [
    {
      id: 'p4_q1',
      num: 1,
      text: 'Một xưởng sản xuất bàn và ghế. Một chiếc bàn cần 1,5 giờ lắp ráp và 1 giờ hoàn thiện; một chiếc ghế cần 1 giờ lắp ráp và 2 giờ hoàn thiện. Bộ phận lắp ráp có 3 nhân công, bộ phận hoàn thiện có 4 nhân công, một nhân công làm việc không quá 8 tiếng mỗi ngày. Thị trường luôn tiêu thụ hết sản phẩm của xưởng và lượng ghế tiêu thụ không vượt quá 3,5 lần số bàn. Biết một chiếc bàn lãi 600 nghìn đồng, một chiếc ghế lãi 450 nghìn đồng. Hỏi xưởng cần sản xuất bao nhiêu số bàn, số ghế trong một ngày để thu được tiền lãi cao nhất?',
      hintInputLabel: 'Đáp số tóm tắt (Số bàn ; Số ghế):',
      placeholderShort: 'Ví dụ: 8 bàn, 12 ghế',
      acceptedKeywords: ['8', '12'],
      displayAnswer: '8 chiếc bàn và 12 chiếc ghế (lãi cao nhất 10 200 nghìn đồng)',
      explanation: `
        Gọi \\(x, y\\) (\\(x, y \\ge 0\\)) lần lượt là số bàn và số ghế sản xuất trong một ngày.<br/>
        • Thời gian lắp ráp tối đa: \\(3 \\times 8 = 24\\) giờ \\(\\Rightarrow 1,5x + y \\le 24\\).<br/>
        • Thời gian hoàn thiện tối đa: \\(4 \\times 8 = 32\\) giờ \\(\\Rightarrow x + 2y \\le 32\\).<br/>
        • Lượng ghế không vượt quá 3,5 lần số bàn: \\(y \\le 3,5x\\).<br/>
        Hàm mục tiêu tiền lãi: \\(F(x; y) = 600x + 450y\\) (nghìn đồng).<br/>
        Miền nghiệm là tứ giác \\(OABC\\) với các đỉnh \\(O(0;0), A(4;14), B(8;12), C(16;0)\\).<br/>
        Tính giá trị \\(F\\) tại các đỉnh:<br/>
        • \\(F(0;0) = 0\\)<br/>
        • \\(F(4;14) = 600 \\cdot 4 + 450 \\cdot 14 = 8700\\) (nghìn đồng)<br/>
        • \\(F(8;12) = 600 \\cdot 8 + 450 \\cdot 12 = 10200\\) (nghìn đồng)<br/>
        • \\(F(16;0) = 600 \\cdot 16 = 9600\\) (nghìn đồng)<br/>
        Vậy xưởng cần sản xuất <strong>8 chiếc bàn và 12 chiếc ghế</strong> mỗi ngày để thu được tiền lãi cao nhất là <strong>10,2 triệu đồng</strong>.
      `
    },
    {
      id: 'p4_q2',
      num: 2,
      text: 'Khối 10 của một trường THPT có 440 em học sinh, trong đó có 250 em thích môn Văn, 210 em thích môn Toán, 240 em thích môn Anh, 65 em không thích môn nào, 75 em thích cả ba môn. Hỏi số em chỉ thích một trong ba môn trên là bao nhiêu?',
      hintInputLabel: 'Đáp số (số học sinh chỉ thích đúng 1 môn):',
      placeholderShort: 'Ví dụ: 125',
      acceptedKeywords: ['125'],
      displayAnswer: '125 học sinh',
      explanation: `
        Số học sinh thích ít nhất một trong ba môn Văn, Toán, Anh là: \\(440 - 65 = 375\\) (em).<br/>
        Gọi \\(a\\) là số học sinh chỉ thích đúng 1 môn, \\(b\\) là số học sinh chỉ thích đúng 2 môn, và \\(c = 75\\) là số học sinh thích cả 3 môn.<br/>
        Ta có hệ phương trình:<br/>
        \\(\\begin{cases} a + b + c = 375 \\\\ a + 2b + 3c = 250 + 210 + 240 = 700 \\end{cases}\\)<br/>
        Thay \\(c = 75\\) vào hệ:<br/>
        \\(\\begin{cases} a + b = 300 \\\\ a + 2b = 475 \\end{cases} \\Rightarrow b = 175 \\Rightarrow a = 300 - 175 = 125\\).<br/>
        Vậy có <strong>125 em</strong> chỉ thích một trong ba môn trên.
      `
    }
  ]
};

// Trạng thái phiên làm bài của học sinh hiện tại
let currentStudent = null;
let studentAnswers = {};
let timerInterval = null;
let remainingSeconds = 90 * 60;
let examStartTime = null;
let isTeacherLoggedIn = false;
let isExamInProgress = false;
let tabSwitchCount = 0;
let tabSwitchLogs = [];
let lastViolationTimestamp = 0;

// Khởi tạo khi tải trang
window.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  renderExamQuestions();
  renderTeacherSolutions();
  syncSubmissionsFromServer();
  initAntiCheatMonitor();
});

// ============================================================================
// HỆ THỐNG GIÁM SÁT CHỐNG GIAN LẬN (PHÁT HIỆN CHUYỂN TAB / RỜI CỬA SỔ THI)
// ============================================================================
function initAntiCheatMonitor() {
  // 1. Phát hiện khi học sinh chuyển sang tab khác hoặc thu nhỏ trình duyệt
  document.addEventListener('visibilitychange', () => {
    if (isExamInProgress && document.hidden) {
      recordTabSwitchViolation('Chuyển sang tab khác hoặc ẩn trình duyệt');
    }
  });

  // 2. Phát hiện khi học sinh bấm ra ngoài cửa sổ trình duyệt (mở Zalo, ứng dụng khác, chia đôi màn hình)
  window.addEventListener('blur', () => {
    if (isExamInProgress) {
      recordTabSwitchViolation('Rời khỏi cửa sổ làm bài (mở ứng dụng/cửa sổ khác)');
    }
  });
}

function recordTabSwitchViolation(reason) {
  if (!isExamInProgress) return;
  const nowMs = Date.now();
  // Chống đếm trùng khi visibilitychange và blur kích hoạt cùng lúc trong 1.2 giây
  if (nowMs - lastViolationTimestamp < 1200) return;
  lastViolationTimestamp = nowMs;

  tabSwitchCount++;
  const timeStr = new Date().toLocaleTimeString('vi-VN');
  tabSwitchLogs.push(`${timeStr} - Lần ${tabSwitchCount}: ${reason}`);

  updateTabSwitchUI();

  const maxAllowed = Number(appSettings.maxTabSwitches) || 0;
  if (maxAllowed > 0 && tabSwitchCount >= maxAllowed) {
    closeTabWarningModal();
    alert(`🚨 VI PHẠM QUY CHẾ THI!\nEm đã chuyển tab / rời khỏi màn hình làm bài ${tabSwitchCount}/${maxAllowed} lần (vượt quá giới hạn cho phép).\nHệ thống sẽ TỰ ĐỘNG THU BÀI và báo cáo cho Giáo viên!`);
    submitExamNow(true);
    return;
  }

  const msgEl = document.getElementById('tabWarningMessage');
  if (msgEl) {
    const limitText = maxAllowed > 0
      ? `Giới hạn tối đa: <strong>${tabSwitchCount} / ${maxAllowed} lần</strong>. Nếu chạm mức ${maxAllowed} lần, hệ thống sẽ <strong>tự động thu bài ngay lập tức</strong>!`
      : `Tổng số lần vi phạm hiện tại: <strong>${tabSwitchCount} lần</strong>.`;
    msgEl.innerHTML = `
      Hệ thống phát hiện em vừa <strong>chuyển tab hoặc rời khỏi màn hình làm bài</strong> lúc <strong>${timeStr}</strong>.<br/><br/>
      ${limitText}<br/>
      <span style="color:#dc2626; font-size:0.88rem;">* Mọi hành vi chuyển tab đều đã được ghi vào nhật ký gửi cho Giáo viên!</span>
    `;
  }
  document.getElementById('tabWarningModal')?.classList.remove('hidden');
}

function updateTabSwitchUI() {
  const countEl = document.getElementById('tabSwitchCountDisplay');
  const maxEl = document.getElementById('tabSwitchMaxDisplay');
  const boxEl = document.getElementById('tabSwitchCounterBox');
  const maxAllowed = Number(appSettings.maxTabSwitches) || 0;

  if (countEl) countEl.textContent = tabSwitchCount;
  if (maxEl) maxEl.textContent = maxAllowed > 0 ? maxAllowed : '∞';

  if (boxEl) {
    if (tabSwitchCount === 0) {
      boxEl.style.background = '#f0fdf4';
      boxEl.style.borderColor = '#86efac';
      boxEl.style.color = '#166534';
    } else if (maxAllowed > 0 && tabSwitchCount >= maxAllowed - 1) {
      boxEl.style.background = '#fef2f2';
      boxEl.style.borderColor = '#fca5a5';
      boxEl.style.color = '#dc2626';
    } else {
      boxEl.style.background = '#fffbeb';
      boxEl.style.borderColor = '#fcd34d';
      boxEl.style.color = '#b45309';
    }
  }
}

function closeTabWarningModal() {
  document.getElementById('tabWarningModal')?.classList.add('hidden');
}

function renderMathIn(element) {
  if (window.renderMathInElement) {
    window.renderMathInElement(element || document.body, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '\\(', right: '\\)', display: false }
      ],
      throwOnError: false
    });
  } else {
    setTimeout(() => renderMathIn(element), 250);
  }
}

// ============================================================================
// MÃ HÓA BẢO MẬT BÀI NỘP (HỌC SINH KHÔNG THỂ XEM ĐIỂM)
// ============================================================================
function encodeSubmissionToken(record) {
  const jsonStr = JSON.stringify(record);
  const utf8Bytes = new TextEncoder().encode(jsonStr);
  const keyBytes = new TextEncoder().encode(SECRET_CIPHER_KEY);
  const xored = new Uint8Array(utf8Bytes.length);
  for (let i = 0; i < utf8Bytes.length; i++) {
    xored[i] = utf8Bytes[i] ^ keyBytes[i % keyBytes.length];
  }
  let binary = '';
  for (let i = 0; i < xored.length; i++) {
    binary += String.fromCharCode(xored[i]);
  }
  return 'MT10-' + btoa(binary);
}

function decodeSubmissionToken(tokenStr) {
  const clean = tokenStr.trim();
  const idx = clean.indexOf('MT10-');
  if (idx === -1) return null;
  const b64 = clean.substring(idx + 5).trim().split(/\s+/)[0];
  const binary = atob(b64);
  const xored = new Uint8Array(binary.length);
  const keyBytes = new TextEncoder().encode(SECRET_CIPHER_KEY);
  for (let i = 0; i < binary.length; i++) {
    xored[i] = binary.charCodeAt(i) ^ keyBytes[i % keyBytes.length];
  }
  const jsonStr = new TextDecoder().decode(xored);
  return JSON.parse(jsonStr);
}

// ============================================================================
// QUẢN LÝ CÀI ĐẶT & ĐỒNG BỘ ĐÁM MÂY (CLOUD) + LOCALSTORAGE
// ============================================================================
function loadSettings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (saved) {
      appSettings = { ...appSettings, ...JSON.parse(saved) };
    }
  } catch (e) {}
  document.getElementById('examDurationDisplay').textContent = appSettings.durationMinutes;
  const maxNotice = document.getElementById('maxTabSwitchNotice');
  if (maxNotice) maxNotice.textContent = appSettings.maxTabSwitches ?? 3;
  const durInput = document.getElementById('settingDuration');
  if (durInput) durInput.value = appSettings.durationMinutes;
  const maxTabInput = document.getElementById('settingMaxTabSwitches');
  if (maxTabInput) maxTabInput.value = appSettings.maxTabSwitches ?? 3;
  const cloudInput = document.getElementById('settingCloudRoom');
  if (cloudInput) cloudInput.value = appSettings.cloudRoomId || 'TOAN10_DE01_GV_ROOM_9871';
}

function saveSettings() {
  const newDur = parseInt(document.getElementById('settingDuration').value, 10);
  const newMaxTabs = parseInt(document.getElementById('settingMaxTabSwitches')?.value, 10);
  const newPass = document.getElementById('settingNewPass').value.trim();
  const newCloud = (document.getElementById('settingCloudRoom')?.value || '').trim();
  if (newDur && newDur >= 5) {
    appSettings.durationMinutes = newDur;
  }
  if (!isNaN(newMaxTabs) && newMaxTabs >= 0) {
    appSettings.maxTabSwitches = newMaxTabs;
  }
  if (newCloud.length > 0) {
    appSettings.cloudRoomId = newCloud.replace(/[^a-zA-Z0-9_-]/g, '_');
  }
  if (newPass.length > 0) {
    appSettings.teacherPassword = newPass;
    document.getElementById('settingNewPass').value = '';
  }
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(appSettings));
  document.getElementById('examDurationDisplay').textContent = appSettings.durationMinutes;
  const maxNotice = document.getElementById('maxTabSwitchNotice');
  if (maxNotice) maxNotice.textContent = appSettings.maxTabSwitches;
  alert('Đã lưu cài đặt thành công!');
}

function getSubmissions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveSubmissionsLocal(list) {
  localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(list));
}

function mergeSubmissionList(existingList, newItems) {
  const map = new Map();
  existingList.forEach(item => map.set(item.id, item));
  newItems.forEach(item => {
    if (item && item.id && item.scores) {
      map.set(item.id, item);
    }
  });
  return Array.from(map.values()).sort((a, b) => (b.id > a.id ? 1 : -1));
}

async function syncSubmissionsFromServer() {
  let currentList = getSubmissions();

  // 1. Thử đồng bộ từ Server nội bộ (nếu có chạy server.py)
  try {
    const res = await fetch('/api/submissions');
    if (res.ok) {
      const serverData = await res.json();
      if (Array.isArray(serverData)) {
        currentList = mergeSubmissionList(currentList, serverData);
        saveSubmissionsLocal(currentList);
      }
    }
  } catch (e) {}

  // 2. Đồng bộ tự động từ Phòng Thi Đám Mây (Cloud Room - không cần máy chủ của Giáo viên)
  const room = appSettings.cloudRoomId || 'TOAN10_DE01_GV_ROOM_9871';
  try {
    const cloudRes = await fetch(`https://ntfy.sh/${encodeURIComponent(room)}/json?poll=1&since=all`);
    if (cloudRes.ok) {
      const text = await cloudRes.text();
      const lines = text.split('\n').filter(Boolean);
      const cloudRecords = [];
      lines.forEach(line => {
        try {
          const msg = JSON.parse(line);
          if (msg && msg.message && msg.message.includes('MT10-')) {
            const decoded = decodeSubmissionToken(msg.message);
            if (decoded && decoded.id) cloudRecords.push(decoded);
          }
        } catch (err) {}
      });
      if (cloudRecords.length > 0) {
        currentList = mergeSubmissionList(currentList, cloudRecords);
        saveSubmissionsLocal(currentList);
      }
    }
  } catch (e) {}

  if (isTeacherLoggedIn) {
    renderSubmissionsTable();
  }
}

async function pushSubmissionToServer(submission, encryptedToken) {
  const list = getSubmissions();
  const updated = mergeSubmissionList(list, [submission]);
  saveSubmissionsLocal(updated);

  const statusEl = document.getElementById('subSyncStatus');

  // 1. Gửi lên Phòng Thi Đám Mây (để học sinh ở máy khác nộp bài mà không cần máy chủ Giáo viên)
  const room = appSettings.cloudRoomId || 'TOAN10_DE01_GV_ROOM_9871';
  let cloudOk = false;
  try {
    const resCloud = await fetch(`https://ntfy.sh/${encodeURIComponent(room)}`, {
      method: 'POST',
      body: encryptedToken
    });
    if (resCloud.ok) cloudOk = true;
  } catch (e) {}

  // 2. Gửi về Server nội bộ (nếu có)
  try {
    await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submission)
    });
  } catch (e) {}

  if (statusEl) {
    statusEl.textContent = cloudOk
      ? 'Đã đồng bộ trực tuyến lên Đám mây của Giáo viên'
      : 'Đã mã hóa kết quả bảo mật (Hãy sao chép Mã Nộp Bài gửi Giáo viên)';
  }
}

// ============================================================================
// CHUYỂN ĐỔI CỔNG HỌC SINH / CỔNG GIÁO VIÊN
// ============================================================================
function switchPortal(portal) {
  const stPortal = document.getElementById('studentPortal');
  const tcPortal = document.getElementById('teacherPortal');
  const btnSt = document.getElementById('btnStudentPortal');
  const btnTc = document.getElementById('btnTeacherPortal');

  if (portal === 'student') {
    stPortal.classList.remove('hidden');
    tcPortal.classList.add('hidden');
    btnSt.classList.add('active');
    btnTc.classList.remove('active');
  } else {
    stPortal.classList.add('hidden');
    tcPortal.classList.remove('hidden');
    btnSt.classList.remove('active');
    btnTc.classList.add('active');
    if (isTeacherLoggedIn) {
      syncSubmissionsFromServer();
      renderSubmissionsTable();
    }
  }
}

// ============================================================================
// HIỂN THỊ CÂU HỎI CHO HỌC SINH LÀM BÀI
// ============================================================================
function renderExamQuestions() {
  const container = document.getElementById('examQuestionsContainer');
  const navGrid = document.getElementById('questionNavGrid');
  let html = '';
  let navHtml = '';
  let globalIdx = 0;

  // Khung hiển thị file đề đính kèm nếu giáo viên có tải thêm
  const attached = localStorage.getItem(STORAGE_KEYS.ATTACHED_FILE);
  if (attached) {
    try {
      const fileObj = JSON.parse(attached);
      if (fileObj && fileObj.dataUrl) {
        html += `
          <div class="card">
            <h3 style="color: var(--primary-dark); margin-bottom: 0.6rem;">📎 Tệp Đề Thi Đính Kèm: ${fileObj.name}</h3>
            ${fileObj.type.includes('pdf')
              ? `<iframe src="${fileObj.dataUrl}" width="100%" height="500px" style="border:1px solid #cbd5e1; border-radius:8px;"></iframe>`
              : `<img src="${fileObj.dataUrl}" style="max-width:100%; border-radius:8px;" alt="Đề thi"/>`
            }
          </div>
        `;
      }
    } catch (e) {}
  }

  // PHẦN I
  html += `
    <div class="section-header">
      <h3>PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN</h3>
      <p>Thí sinh trả lời từ câu 1 đến câu 12. Mỗi câu thí sinh chỉ chọn một phương án.</p>
    </div>
  `;

  EXAM_DATA.part1.forEach((q) => {
    globalIdx++;
    navHtml += `<button type="button" id="nav_${q.id}" class="q-nav-btn" onclick="scrollToQuestion('${q.id}')">I.${q.num}</button>`;
    html += `
      <div class="question-card" id="card_${q.id}">
        <div class="q-title">
          <span class="q-badge">Câu ${q.num}</span> ${q.text}
        </div>
        ${q.figure ? `<div class="q-figure">${q.figure}</div>` : ''}
        <div class="mcq-grid">
          ${['A', 'B', 'C', 'D'].map(opt => `
            <label class="mcq-option" id="lbl_${q.id}_${opt}">
              <input type="radio" name="${q.id}" value="${opt}" onchange="handleSelectMCQ('${q.id}', '${opt}')" />
              <span><strong>${opt}.</strong> ${q.options[opt]}</span>
            </label>
          `).join('')}
        </div>
      </div>
    `;
  });

  // PHẦN II
  html += `
    <div class="section-header">
      <h3>PHẦN II. CÂU TRẮC NGHIỆM ĐÚNG SAI</h3>
      <p>Thí sinh trả lời từ câu 1 đến câu 4. Trong mỗi ý a), b), c), d) ở mỗi câu, thí sinh chọn Đúng hoặc Sai.</p>
    </div>
  `;

  EXAM_DATA.part2.forEach((q) => {
    globalIdx++;
    navHtml += `<button type="button" id="nav_${q.id}" class="q-nav-btn" onclick="scrollToQuestion('${q.id}')">II.${q.num}</button>`;
    html += `
      <div class="question-card" id="card_${q.id}">
        <div class="q-title">
          <span class="q-badge">Câu ${q.num}</span> ${q.text}
        </div>
        <table class="tf-table">
          <thead>
            <tr>
              <th>Mệnh đề</th>
              <th class="center">Đúng</th>
              <th class="center">Sai</th>
            </tr>
          </thead>
          <tbody>
            ${q.statements.map(st => `
              <tr>
                <td>${st.text}</td>
                <td class="center">
                  <input type="radio" name="${q.id}_${st.key}" value="true" onchange="handleSelectTF('${q.id}', '${st.key}', true)" />
                </td>
                <td class="center">
                  <input type="radio" name="${q.id}_${st.key}" value="false" onchange="handleSelectTF('${q.id}', '${st.key}', false)" />
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  });

  // PHẦN III
  html += `
    <div class="section-header">
      <h3>PHẦN III. TRẮC NGHIỆM TRẢ LỜI NGẮN</h3>
      <p>Thí sinh trả lời từ câu 1 đến câu 4. Điền kết quả số vào ô trả lời tương ứng.</p>
    </div>
  `;

  EXAM_DATA.part3.forEach((q) => {
    globalIdx++;
    navHtml += `<button type="button" id="nav_${q.id}" class="q-nav-btn" onclick="scrollToQuestion('${q.id}')">III.${q.num}</button>`;
    html += `
      <div class="question-card" id="card_${q.id}">
        <div class="q-title">
          <span class="q-badge">Câu ${q.num}</span> ${q.text}
        </div>
        ${q.figure ? `<div class="q-figure">${q.figure}</div>` : ''}
        <div class="sa-input-wrap">
          <label for="input_${q.id}">Đáp số của em:</label>
          <input type="text" id="input_${q.id}" class="sa-input" placeholder="Nhập kết quả..." oninput="handleInputSA('${q.id}', this.value)" />
        </div>
      </div>
    `;
  });

  // PHẦN IV
  html += `
    <div class="section-header">
      <h3>PHẦN IV. TỰ LUẬN</h3>
      <p>Thí sinh trình bày lời giải chi tiết và kết quả vào ô bên dưới cho câu 1 và câu 2.</p>
    </div>
  `;

  EXAM_DATA.part4.forEach((q) => {
    globalIdx++;
    navHtml += `<button type="button" id="nav_${q.id}" class="q-nav-btn" onclick="scrollToQuestion('${q.id}')">IV.${q.num}</button>`;
    html += `
      <div class="question-card" id="card_${q.id}">
        <div class="q-title">
          <span class="q-badge">Câu ${q.num}</span> ${q.text}
        </div>
        <div class="essay-box">
          <label style="font-weight:600; font-size:0.9rem; display:block; margin-bottom:0.35rem;">Bài giải chi tiết của em:</label>
          <textarea id="essay_${q.id}" class="essay-textarea" placeholder="Trình bày lời giải tự luận tại đây..." oninput="handleInputEssay('${q.id}')"></textarea>
          <div class="sa-input-wrap">
            <label for="short_${q.id}">${q.hintInputLabel}</label>
            <input type="text" id="short_${q.id}" class="sa-input" style="max-width:260px;" placeholder="${q.placeholderShort}" oninput="handleInputEssay('${q.id}')" />
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
  navGrid.innerHTML = navHtml;
  renderMathIn(container);
}

function scrollToQuestion(qId) {
  const el = document.getElementById('card_' + qId);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// ============================================================================
// XỬ LÝ SỰ KIỆN CHỌN ĐÁP ÁN CỦA HỌC SINH
// ============================================================================
function handleSelectMCQ(qId, opt) {
  studentAnswers[qId] = opt;
  ['A', 'B', 'C', 'D'].forEach(o => {
    const lbl = document.getElementById(`lbl_${qId}_${o}`);
    if (lbl) lbl.classList.toggle('selected', o === opt);
  });
  updateProgressUI();
}

function handleSelectTF(qId, subKey, val) {
  if (!studentAnswers[qId]) studentAnswers[qId] = {};
  studentAnswers[qId][subKey] = val;
  updateProgressUI();
}

function handleInputSA(qId, val) {
  studentAnswers[qId] = val.trim();
  updateProgressUI();
}

function handleInputEssay(qId) {
  const work = (document.getElementById(`essay_${qId}`)?.value || '').trim();
  const shortAns = (document.getElementById(`short_${qId}`)?.value || '').trim();
  studentAnswers[qId] = { work, shortAns };
  updateProgressUI();
}

function isQuestionAnswered(qId) {
  const ans = studentAnswers[qId];
  if (!ans) return false;
  if (qId.startsWith('p1_')) return typeof ans === 'string' && ans.length > 0;
  if (qId.startsWith('p2_')) return Object.keys(ans).length === 4;
  if (qId.startsWith('p3_')) return typeof ans === 'string' && ans.length > 0;
  if (qId.startsWith('p4_')) return (ans.work && ans.work.length > 0) || (ans.shortAns && ans.shortAns.length > 0);
  return false;
}

function updateProgressUI() {
  const allIds = [
    ...EXAM_DATA.part1.map(q => q.id),
    ...EXAM_DATA.part2.map(q => q.id),
    ...EXAM_DATA.part3.map(q => q.id),
    ...EXAM_DATA.part4.map(q => q.id)
  ];
  let count = 0;
  allIds.forEach(id => {
    const done = isQuestionAnswered(id);
    if (done) count++;
    const btn = document.getElementById('nav_' + id);
    if (btn) btn.classList.toggle('done', done);
  });
  document.getElementById('answeredCount').textContent = count;
}

// ============================================================================
// BẮT ĐẦU LÀM BÀI & ĐỒNG HỒ ĐẾM NGƯỢC
// ============================================================================
function startExam(e) {
  e.preventDefault();
  const name = document.getElementById('stName').value.trim();
  const stClass = document.getElementById('stClass').value.trim();
  const code = document.getElementById('stCode').value.trim() || '---';

  if (!name || !stClass) {
    alert('Vui lòng nhập đầy đủ Họ và tên và Lớp!');
    return;
  }

  currentStudent = { name, stClass, code };
  studentAnswers = {};
  examStartTime = new Date();
  remainingSeconds = appSettings.durationMinutes * 60;
  isExamInProgress = true;
  tabSwitchCount = 0;
  tabSwitchLogs = [];
  lastViolationTimestamp = 0;

  document.getElementById('displayStName').textContent = name;
  document.getElementById('displayStClass').textContent = stClass;
  document.getElementById('displayStCode').textContent = code;
  updateTabSwitchUI();

  // Reset form inputs inside exam
  renderExamQuestions();
  updateProgressUI();

  document.getElementById('studentStartScreen').classList.add('hidden');
  document.getElementById('studentSubmittedScreen').classList.add('hidden');
  document.getElementById('studentExamScreen').classList.remove('hidden');

  if (timerInterval) clearInterval(timerInterval);
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    remainingSeconds--;
    updateTimerDisplay();
    if (remainingSeconds <= 0) {
      clearInterval(timerInterval);
      alert('Đã hết thời gian làm bài! Hệ thống sẽ tự động thu bài của em.');
      submitExamNow();
    }
  }, 1000);

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateTimerDisplay() {
  const m = Math.floor(Math.max(0, remainingSeconds) / 60);
  const s = Math.max(0, remainingSeconds) % 60;
  document.getElementById('timerDisplay').textContent =
    `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function confirmSubmitExam() {
  const answered = document.getElementById('answeredCount').textContent;
  const ok = confirm(`Em đã hoàn thành ${answered}/22 câu hỏi.\nEm có chắc chắn muốn nộp bài ngay bây giờ không?`);
  if (ok) {
    submitExamNow();
  }
}

// ============================================================================
// CHẤM ĐIỂM NGẦM & LƯU KẾT QUẢ (TUYỆT ĐỐI KHÔNG HIỂN THỊ ĐIỂM CHO HỌC SINH)
// ============================================================================
function normalizeNumberString(str) {
  if (!str) return '';
  return str.toString().trim().replace(/\s+/g, '').replace('.', ',');
}

function gradeSubmission(answers) {
  // Phần I: 12 câu x 0.25đ = 3.0đ
  let scoreP1 = 0;
  EXAM_DATA.part1.forEach(q => {
    if (answers[q.id] === q.answer) {
      scoreP1 += 0.25;
    }
  });

  // Phần II: 4 câu Đúng/Sai (1 ý đúng: 0.1đ, 2 ý đúng: 0.25đ, 3 ý đúng: 0.5đ, 4 ý đúng: 1.0đ)
  let scoreP2 = 0;
  EXAM_DATA.part2.forEach(q => {
    const stAns = answers[q.id] || {};
    let correctCount = 0;
    q.statements.forEach(st => {
      if (stAns[st.key] === st.answer) {
        correctCount++;
      }
    });
    if (correctCount === 1) scoreP2 += 0.1;
    else if (correctCount === 2) scoreP2 += 0.25;
    else if (correctCount === 3) scoreP2 += 0.5;
    else if (correctCount === 4) scoreP2 += 1.0;
  });

  // Phần III: 4 câu trả lời ngắn x 0.5đ = 2.0đ
  let scoreP3 = 0;
  EXAM_DATA.part3.forEach(q => {
    const userVal = normalizeNumberString(answers[q.id]);
    const isCorrect = q.acceptedAnswers.some(acc => normalizeNumberString(acc) === userVal);
    if (isCorrect) {
      scoreP3 += 0.5;
    }
  });

  // Phần IV: 2 câu tự luận x 0.5đ = 1.0đ (Chấm gợi ý tự động theo đáp số + Giáo viên có thể chỉnh sửa)
  let scoreP4 = 0;
  EXAM_DATA.part4.forEach(q => {
    const ansObj = answers[q.id] || { work: '', shortAns: '' };
    const combined = `${ansObj.shortAns} ${ansObj.work}`.toLowerCase();
    const matchedAll = q.acceptedKeywords.every(kw => combined.includes(kw.toLowerCase()));
    if (matchedAll) {
      scoreP4 += 0.5;
    }
  });

  const totalScore = Number((scoreP1 + scoreP2 + scoreP3 + scoreP4).toFixed(2));
  return {
    scoreP1: Number(scoreP1.toFixed(2)),
    scoreP2: Number(scoreP2.toFixed(2)),
    scoreP3: Number(scoreP3.toFixed(2)),
    scoreP4: Number(scoreP4.toFixed(2)),
    totalScore
  };
}

function submitExamNow(forcedByAntiCheat = false) {
  isExamInProgress = false;
  closeTabWarningModal();
  if (timerInterval) clearInterval(timerInterval);
  const now = new Date();
  const timeSpentSec = Math.max(1, Math.round((now - examStartTime) / 1000));
  const mins = Math.floor(timeSpentSec / 60);
  const secs = timeSpentSec % 60;
  const durationText = `${mins} phút ${secs} giây`;

  // Chấm điểm ngầm để lưu cho Giáo viên
  const scores = gradeSubmission(studentAnswers);

  const submissionRecord = {
    id: 'sub_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    studentName: currentStudent.name,
    studentClass: currentStudent.stClass,
    studentCode: currentStudent.code,
    submittedAt: now.toLocaleString('vi-VN'),
    durationText,
    answers: JSON.parse(JSON.stringify(studentAnswers)),
    scores,
    tabSwitchCount,
    tabSwitchLogs: [...tabSwitchLogs],
    forcedByAntiCheat: Boolean(forcedByAntiCheat),
    teacherNote: ''
  };

  lastSubmittedRecord = submissionRecord;
  const encryptedToken = encodeSubmissionToken(submissionRecord);
  const tokenBox = document.getElementById('encryptedSubmissionToken');
  if (tokenBox) tokenBox.value = encryptedToken;

  pushSubmissionToServer(submissionRecord, encryptedToken);

  // Hiển thị màn hình hoàn thành (KHÔNG HIỂN THỊ ĐIỂM SỐ)
  document.getElementById('subStName').textContent = currentStudent.name;
  document.getElementById('subStClass').textContent = currentStudent.stClass;
  document.getElementById('subTime').textContent = submissionRecord.submittedAt;
  document.getElementById('subDuration').textContent = durationText;

  document.getElementById('studentExamScreen').classList.add('hidden');
  document.getElementById('studentSubmittedScreen').classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function copySubmissionToken() {
  const tokenBox = document.getElementById('encryptedSubmissionToken');
  if (!tokenBox || !tokenBox.value) return;
  navigator.clipboard.writeText(tokenBox.value).then(() => {
    alert('✅ Đã sao chép Mã Nộp Bài! Em hãy dán gửi cho Giáo viên qua Zalo/Messenger.');
  }).catch(() => {
    tokenBox.select();
    document.execCommand('copy');
    alert('✅ Đã sao chép Mã Nộp Bài!');
  });
}

function downloadStudentReceiptFile() {
  if (!lastSubmittedRecord) return;
  const token = encodeSubmissionToken(lastSubmittedRecord);
  const content = [
    '====================================================',
    'PHIẾU XÁC NHẬN NỘP BÀI KIỂM TRA TOÁN 10 - ĐỀ SỐ 01',
    '====================================================',
    `Họ và tên học sinh : ${lastSubmittedRecord.studentName}`,
    `Lớp                : ${lastSubmittedRecord.studentClass}`,
    `Số báo danh        : ${lastSubmittedRecord.studentCode}`,
    `Thời điểm nộp      : ${lastSubmittedRecord.submittedAt}`,
    `Thời gian làm bài  : ${lastSubmittedRecord.durationText}`,
    '(Điểm số đã được mã hóa bảo mật bên dưới, chỉ Giáo viên mở được)',
    '----------------------------------------------------',
    token,
    '----------------------------------------------------'
  ].join('\r\n');

  const safeName = lastSubmittedRecord.studentName.replace(/[^a-zA-Z0-9\u00C0-\u1EF9]/g, '_');
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `PhieuNopBai_${safeName}_${lastSubmittedRecord.studentClass}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

function openImportTokenModal() {
  document.getElementById('pasteTokenTextarea').value = '';
  document.getElementById('importTokenModal').classList.remove('hidden');
}

function closeImportTokenModal() {
  document.getElementById('importTokenModal').classList.add('hidden');
}

function processPastedTokens() {
  const raw = document.getElementById('pasteTokenTextarea').value;
  if (!raw.trim()) {
    alert('Vui lòng dán ít nhất 1 Mã Nộp Bài bắt đầu bằng MT10-...');
    return;
  }
  const matches = raw.match(/MT10-[A-Za-z0-9+/=]+/g) || [];
  const decodedList = [];
  matches.forEach(token => {
    try {
      const rec = decodeSubmissionToken(token);
      if (rec && rec.id && rec.scores) {
        decodedList.push(rec);
      }
    } catch (e) {}
  });

  if (decodedList.length === 0) {
    alert('❌ Không tìm thấy Mã Nộp Bài hợp lệ! Hãy kiểm tra lại chuỗi mã MT10-...');
    return;
  }

  const updated = mergeSubmissionList(getSubmissions(), decodedList);
  saveSubmissionsLocal(updated);
  renderSubmissionsTable();
  closeImportTokenModal();
  alert(`✅ Đã giải mã thành công ${decodedList.length} bài nộp của học sinh vào bảng điểm!`);
}

function handleImportReceiptFiles(e) {
  const files = Array.from(e.target.files || []);
  if (files.length === 0) return;
  let processed = 0;
  const decodedList = [];

  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      processed++;
      const text = ev.target.result || '';
      const matches = text.match(/MT10-[A-Za-z0-9+/=]+/g) || [];
      matches.forEach(token => {
        try {
          const rec = decodeSubmissionToken(token);
          if (rec && rec.id && rec.scores) decodedList.push(rec);
        } catch (err) {}
      });

      if (processed === files.length) {
        if (decodedList.length > 0) {
          const updated = mergeSubmissionList(getSubmissions(), decodedList);
          saveSubmissionsLocal(updated);
          renderSubmissionsTable();
          closeImportTokenModal();
          alert(`✅ Đã nhập và giải mã thành công ${decodedList.length} phiếu nộp bài!`);
        } else {
          alert('❌ Không tìm thấy dữ liệu bài nộp hợp lệ trong tệp!');
        }
      }
    };
    reader.readAsText(file);
  });
}

function resetForNewStudent() {
  currentStudent = null;
  studentAnswers = {};
  document.getElementById('startExamForm').reset();
  document.getElementById('studentSubmittedScreen').classList.add('hidden');
  document.getElementById('studentStartScreen').classList.remove('hidden');
}

// ============================================================================
// CỔNG GIÁO VIÊN: ĐĂNG NHẬP & QUẢN LÝ ĐIỂM SỐ
// ============================================================================
function loginTeacher(e) {
  e.preventDefault();
  const inputPass = document.getElementById('teacherPassInput').value;
  const errEl = document.getElementById('loginErrorMsg');

  if (inputPass === appSettings.teacherPassword) {
    isTeacherLoggedIn = true;
    errEl.classList.add('hidden');
    document.getElementById('teacherPassInput').value = '';
    document.getElementById('teacherLoginScreen').classList.add('hidden');
    document.getElementById('teacherDashboard').classList.remove('hidden');
    syncSubmissionsFromServer();
    renderSubmissionsTable();
    renderMathIn(document.getElementById('teacherDashboard'));
  } else {
    errEl.classList.remove('hidden');
  }
}

function logoutTeacher() {
  isTeacherLoggedIn = false;
  document.getElementById('teacherDashboard').classList.add('hidden');
  document.getElementById('teacherLoginScreen').classList.remove('hidden');
}

function switchTeacherTab(tabName) {
  const tabs = ['submissions', 'solutions', 'manage'];
  tabs.forEach(t => {
    const cap = t.charAt(0).toUpperCase() + t.slice(1);
    document.getElementById('teacherTab' + cap).classList.toggle('hidden', t !== tabName);
    document.getElementById('tabBtn' + cap).classList.toggle('active', t === tabName);
  });
  if (tabName === 'solutions') {
    renderMathIn(document.getElementById('teacherTabSolutions'));
  }
}

function refreshSubmissions() {
  syncSubmissionsFromServer();
  renderSubmissionsTable();
}

function renderSubmissionsTable() {
  const list = getSubmissions();
  const keyword = (document.getElementById('searchStudentInput')?.value || '').toLowerCase().trim();
  const filtered = list.filter(item =>
    item.studentName.toLowerCase().includes(keyword) ||
    item.studentClass.toLowerCase().includes(keyword) ||
    (item.studentCode && item.studentCode.toLowerCase().includes(keyword))
  );

  document.getElementById('totalSubmissionsBadge').textContent = list.length;
  document.getElementById('statCount').textContent = list.length;

  if (list.length > 0) {
    const totals = list.map(i => i.scores.totalScore);
    const avg = totals.reduce((a, b) => a + b, 0) / totals.length;
    const max = Math.max(...totals);
    const min = Math.min(...totals);
    document.getElementById('statAvg').textContent = avg.toFixed(2);
    document.getElementById('statMax').textContent = max.toFixed(2);
    document.getElementById('statMin').textContent = min.toFixed(2);
  } else {
    document.getElementById('statAvg').textContent = '0.00';
    document.getElementById('statMax').textContent = '0.00';
    document.getElementById('statMin').textContent = '0.00';
  }

  const tbody = document.getElementById('submissionsTableBody');
  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="12" style="text-align: center; padding: 2rem; color: var(--text-muted);">
          Chưa có bài nộp nào của học sinh.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map((item, idx) => {
    const vCount = Number(item.tabSwitchCount) || 0;
    let monitorBadge = `<span style="background:#dcfce7; color:#166534; padding:0.2rem 0.55rem; border-radius:999px; font-weight:700; font-size:0.8rem;">✅ 0 lần</span>`;
    if (item.forcedByAntiCheat) {
      monitorBadge = `<span style="background:#fee2e2; color:#b91c1c; padding:0.2rem 0.55rem; border-radius:999px; font-weight:700; font-size:0.8rem;">🚨 Thu bài (${vCount} lần)</span>`;
    } else if (vCount > 0) {
      monitorBadge = `<span style="background:#fef3c7; color:#b45309; padding:0.2rem 0.55rem; border-radius:999px; font-weight:700; font-size:0.8rem;">⚠️ Rời tab ${vCount} lần</span>`;
    }

    return `
      <tr>
        <td>${idx + 1}</td>
        <td><strong>${escapeHtml(item.studentName)}</strong></td>
        <td>${escapeHtml(item.studentClass)}</td>
        <td>${escapeHtml(item.studentCode)}</td>
        <td>${item.scores.scoreP1.toFixed(2)}</td>
        <td>${item.scores.scoreP2.toFixed(2)}</td>
        <td>${item.scores.scoreP3.toFixed(2)}</td>
        <td>${item.scores.scoreP4.toFixed(2)}</td>
        <td><span class="badge-score">${item.scores.totalScore.toFixed(2)} / 10</span></td>
        <td>${monitorBadge}</td>
        <td style="font-size:0.84rem;">${item.submittedAt}<br/><span style="color:#64748b;">(${item.durationText})</span></td>
        <td>
          <button class="btn btn-primary" style="padding: 0.35rem 0.7rem; font-size: 0.82rem;" onclick="openSubmissionDetail('${item.id}')">
            👁 Xem & Chấm
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

// ============================================================================
// XEM CHI TIẾT BÀI LÀM CỦA TỪNG HỌC SINH & CHẤM TỰ LUẬN
// ============================================================================
function openSubmissionDetail(subId) {
  const list = getSubmissions();
  const sub = list.find(s => s.id === subId);
  if (!sub) return;

  document.getElementById('modalStudentTitle').innerHTML =
    `Bài làm: ${escapeHtml(sub.studentName)} (${escapeHtml(sub.studentClass)}) — Tổng điểm: <span style="color:var(--accent)">${sub.scores.totalScore.toFixed(2)}/10</span>`;

  const vCount = Number(sub.tabSwitchCount) || 0;
  const vLogs = Array.isArray(sub.tabSwitchLogs) ? sub.tabSwitchLogs : [];

  let html = `
    <div style="background:#f8fafc; padding:1rem; border-radius:8px; margin-bottom:1rem; border:1px solid #e2e8f0; display:flex; justify-content:space-between; flex-wrap:wrap; gap:0.5rem;">
      <div><strong>Thời điểm nộp:</strong> ${sub.submittedAt} (${sub.durationText})</div>
      <div>
        <strong>Điểm thành phần:</strong>
        Phần I: ${sub.scores.scoreP1}đ | Phần II: ${sub.scores.scoreP2}đ | Phần III: ${sub.scores.scoreP3}đ | Phần IV: ${sub.scores.scoreP4}đ
      </div>
    </div>

    <div style="background:${vCount > 0 ? '#fef2f2' : '#f0fdf4'}; border:1px solid ${vCount > 0 ? '#fca5a5' : '#86efac'}; padding:0.85rem 1rem; border-radius:8px; margin-bottom:1rem; font-size:0.9rem;">
      <div style="font-weight:700; color:${vCount > 0 ? '#b91c1c' : '#166534'};">
        🛡 Giám sát quy chế thi (Chuyển tab / Rời màn hình): ${vCount} lần ${sub.forcedByAntiCheat ? '— ĐÃ BỊ TỰ ĐỘNG THU BÀI DO VƯỢT QUÁ GIỚI HẠN' : ''}
      </div>
      ${vLogs.length > 0
        ? `<ul style="margin:0.4rem 0 0 1.2rem; color:#7f1d1d; font-size:0.85rem;">${vLogs.map(l => `<li>${escapeHtml(l)}</li>`).join('')}</ul>`
        : `<div style="color:#15803d; font-size:0.85rem; margin-top:0.2rem;">Học sinh làm bài nghiêm túc, không chuyển tab lần nào.</div>`
      }
    </div>
  `;

  // Chi tiết Phần I
  html += `<h4 style="margin: 0.75rem 0 0.5rem; color:var(--primary-dark);">PHẦN I. Trắc nghiệm 4 lựa chọn (${sub.scores.scoreP1} / 3,0đ)</h4>`;
  html += `<div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap:0.5rem; margin-bottom:1rem;">`;
  EXAM_DATA.part1.forEach(q => {
    const userAns = sub.answers[q.id] || 'Chưa chọn';
    const isOk = userAns === q.answer;
    html += `
      <div style="padding:0.5rem 0.75rem; border-radius:6px; border:1px solid ${isOk ? '#86efac' : '#fca5a5'}; background:${isOk ? '#f0fdf4' : '#fef2f2'}; font-size:0.88rem;">
        <strong>Câu ${q.num}:</strong> HS chọn <strong>${userAns}</strong>
        ${isOk ? '✅' : `❌ (Đ/A: <strong>${q.answer}</strong>)`}
      </div>
    `;
  });
  html += `</div>`;

  // Chi tiết Phần II
  html += `<h4 style="margin: 0.75rem 0 0.5rem; color:var(--primary-dark);">PHẦN II. Trắc nghiệm Đúng/Sai (${sub.scores.scoreP2} / 4,0đ)</h4>`;
  EXAM_DATA.part2.forEach(q => {
    const stAns = sub.answers[q.id] || {};
    html += `<div style="margin-bottom:0.6rem; padding:0.65rem; border:1px solid #e2e8f0; border-radius:6px; font-size:0.88rem;"><strong>Câu ${q.num}:</strong> `;
    html += q.statements.map(st => {
      const uVal = stAns[st.key];
      const uText = uVal === true ? 'Đúng' : uVal === false ? 'Sai' : 'Trống';
      const cText = st.answer ? 'Đúng' : 'Sai';
      const ok = uVal === st.answer;
      return `<span style="margin-right:1rem;">Ý ${st.key}): HS chọn <strong>${uText}</strong> ${ok ? '✅' : `❌ (${cText})`}</span>`;
    }).join('');
    html += `</div>`;
  });

  // Chi tiết Phần III
  html += `<h4 style="margin: 0.75rem 0 0.5rem; color:var(--primary-dark);">PHẦN III. Trắc nghiệm trả lời ngắn (${sub.scores.scoreP3} / 2,0đ)</h4>`;
  html += `<div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap:0.5rem; margin-bottom:1rem;">`;
  EXAM_DATA.part3.forEach(q => {
    const userVal = sub.answers[q.id] || 'Chưa điền';
    const isOk = q.acceptedAnswers.some(acc => normalizeNumberString(acc) === normalizeNumberString(userVal));
    html += `
      <div style="padding:0.55rem 0.75rem; border-radius:6px; border:1px solid ${isOk ? '#86efac' : '#fca5a5'}; background:${isOk ? '#f0fdf4' : '#fef2f2'}; font-size:0.88rem;">
        <strong>Câu ${q.num}:</strong> HS điền <strong>${escapeHtml(userVal)}</strong>
        ${isOk ? '✅' : `❌ (Đ/A: <strong>${q.displayAnswer}</strong>)`}
      </div>
    `;
  });
  html += `</div>`;

  // Chi tiết Phần IV (Tự luận + Ô chấm điểm cho Giáo viên)
  html += `<h4 style="margin: 0.75rem 0 0.5rem; color:var(--primary-dark);">PHẦN IV. Tự luận (${sub.scores.scoreP4} / 1,0đ)</h4>`;
  EXAM_DATA.part4.forEach(q => {
    const ansObj = sub.answers[q.id] || { work: '', shortAns: '' };
    html += `
      <div style="padding:0.85rem; border:1px solid #cbd5e1; border-radius:8px; margin-bottom:0.75rem; background:#f8fafc;">
        <div style="font-weight:700; margin-bottom:0.35rem;">Câu ${q.num}:</div>
        <div style="font-size:0.9rem; margin-bottom:0.35rem;"><strong>Đáp số tóm tắt của HS:</strong> ${escapeHtml(ansObj.shortAns || '(Không điền)')}</div>
        <div style="font-size:0.9rem; background:#fff; padding:0.65rem; border-radius:6px; border:1px solid #e2e8f0; white-space:pre-wrap;">${escapeHtml(ansObj.work || '(Học sinh không trình bày lời giải tự luận)')}</div>
        <div style="font-size:0.85rem; color:#15803d; margin-top:0.4rem;"><strong>Đáp án chuẩn:</strong> ${q.displayAnswer}</div>
      </div>
    `;
  });

  // Khung cập nhật điểm Phần IV của Giáo viên
  html += `
    <div style="background:#eff6ff; padding:1rem; border-radius:8px; border:1px solid #bfdbfe; margin-top:1rem;">
      <label style="font-weight:700; display:block; margin-bottom:0.4rem;">✏️ Giáo viên điều chỉnh điểm Phần IV - Tự luận (tối đa 1.0 điểm):</label>
      <div style="display:flex; gap:0.75rem; align-items:center; flex-wrap:wrap;">
        <input type="number" id="editScoreP4Input" class="form-control" style="max-width:140px;" step="0.05" min="0" max="1" value="${sub.scores.scoreP4}" />
        <button class="btn btn-primary" onclick="updateEssayScore('${sub.id}')">💾 Cập nhật điểm</button>
      </div>
    </div>
  `;

  document.getElementById('modalBodyContent').innerHTML = html;
  document.getElementById('detailModal').classList.remove('hidden');
}

function closeDetailModal() {
  document.getElementById('detailModal').classList.add('hidden');
}

async function updateEssayScore(subId) {
  const newP4 = parseFloat(document.getElementById('editScoreP4Input').value);
  if (isNaN(newP4) || newP4 < 0 || newP4 > 10) {
    alert('Điểm không hợp lệ!');
    return;
  }
  const list = getSubmissions();
  const idx = list.findIndex(s => s.id === subId);
  if (idx === -1) return;

  list[idx].scores.scoreP4 = Number(newP4.toFixed(2));
  list[idx].scores.totalScore = Number(
    (list[idx].scores.scoreP1 + list[idx].scores.scoreP2 + list[idx].scores.scoreP3 + list[idx].scores.scoreP4).toFixed(2)
  );
  saveSubmissionsLocal(list);

  try {
    await fetch('/api/update_submission', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(list[idx])
    });
  } catch (e) {}

  renderSubmissionsTable();
  openSubmissionDetail(subId);
  alert('Đã cập nhật điểm tự luận và tổng điểm!');
}

async function clearAllSubmissions() {
  if (!confirm('Bạn có chắc chắn muốn xóa toàn bộ danh sách bài nộp của học sinh không?')) return;
  saveSubmissionsLocal([]);
  try {
    await fetch('/api/clear', { method: 'POST' });
  } catch (e) {}
  renderSubmissionsTable();
}

// ============================================================================
// HIỂN THỊ BẢNG ĐÁP ÁN & LỜI GIẢI CHI TIẾT ĐỀ 01 CHO GIÁO VIÊN
// ============================================================================
function renderTeacherSolutions() {
  const container = document.getElementById('fullSolutionsContainer');
  let html = '';

  // Bảng đáp án nhanh Phần I
  html += `<h3 style="color:var(--primary-dark); margin: 1rem 0 0.6rem;">I. Bảng Đáp Án Nhanh Phần I (Trắc nghiệm 4 lựa chọn)</h3>`;
  html += `<div style="display:grid; grid-template-columns:repeat(6, 1fr); gap:0.5rem; margin-bottom:1.25rem; text-align:center;">`;
  EXAM_DATA.part1.forEach(q => {
    html += `<div style="background:#f1f5f9; padding:0.5rem; border-radius:6px; border:1px solid #cbd5e1;"><strong>Câu ${q.num}:</strong> <span style="color:var(--primary); font-weight:800;">${q.answer}</span></div>`;
  });
  html += `</div>`;

  // Lời giải chi tiết Phần I
  EXAM_DATA.part1.forEach(q => {
    html += `
      <div class="solution-item">
        <div><strong>Câu ${q.num} (Phần I) — Chọn đáp án <span class="correct-tag">${q.answer}</span></strong></div>
        <div style="font-size:0.92rem; margin-top:0.25rem;">${q.explanation}</div>
      </div>
    `;
  });

  // Lời giải chi tiết Phần II
  html += `<h3 style="color:var(--primary-dark); margin: 1.5rem 0 0.6rem;">II. Đáp Án & Giải Chi Tiết Phần II (Trắc nghiệm Đúng/Sai)</h3>`;
  EXAM_DATA.part2.forEach(q => {
    const summary = q.statements.map(s => `${s.key}) <strong>${s.answer ? 'Đúng' : 'Sai'}</strong>`).join(' &nbsp;|&nbsp; ');
    html += `
      <div class="solution-item">
        <div><strong>Câu ${q.num} (Phần II):</strong> ${summary}</div>
        <div style="font-size:0.92rem; margin-top:0.35rem;">${q.explanation}</div>
      </div>
    `;
  });

  // Lời giải chi tiết Phần III
  html += `<h3 style="color:var(--primary-dark); margin: 1.5rem 0 0.6rem;">III. Đáp Án & Giải Chi Tiết Phần III (Trắc nghiệm trả lời ngắn)</h3>`;
  EXAM_DATA.part3.forEach(q => {
    html += `
      <div class="solution-item">
        <div><strong>Câu ${q.num} (Phần III) — Đáp số: <span class="correct-tag">${q.displayAnswer}</span></strong></div>
        <div style="font-size:0.92rem; margin-top:0.35rem;">${q.explanation}</div>
      </div>
    `;
  });

  // Lời giải chi tiết Phần IV
  html += `<h3 style="color:var(--primary-dark); margin: 1.5rem 0 0.6rem;">IV. Đáp Án & Giải Chi Tiết Phần IV (Tự luận)</h3>`;
  EXAM_DATA.part4.forEach(q => {
    html += `
      <div class="solution-item">
        <div><strong>Câu ${q.num} (Phần IV) — Kết quả: <span class="correct-tag">${q.displayAnswer}</span></strong></div>
        <div style="font-size:0.92rem; margin-top:0.35rem;">${q.explanation}</div>
      </div>
    `;
  });

  container.innerHTML = html;
}

// ============================================================================
// XUẤT EXCEL (CSV) & SAO LƯU JSON & ĐÍNH KÈM ĐỀ
// ============================================================================
function exportCSV() {
  const list = getSubmissions();
  if (list.length === 0) {
    alert('Chưa có dữ liệu điểm để xuất!');
    return;
  }
  const headers = ['STT', 'Họ và tên', 'Lớp', 'SBD', 'Phần I (3đ)', 'Phần II (4đ)', 'Phần III (2đ)', 'Phần IV (1đ)', 'Tổng Điểm (10đ)', 'Số lần chuyển tab', 'Thời gian nộp', 'Thời gian làm'];
  const rows = list.map((item, idx) => [
    idx + 1,
    `"${item.studentName.replace(/"/g, '""')}"`,
    `"${item.studentClass.replace(/"/g, '""')}"`,
    `"${(item.studentCode || '').replace(/"/g, '""')}"`,
    item.scores.scoreP1,
    item.scores.scoreP2,
    item.scores.scoreP3,
    item.scores.scoreP4,
    item.scores.totalScore,
    item.tabSwitchCount || 0,
    `"${item.submittedAt}"`,
    `"${item.durationText}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Bang_Diem_Lop_10_De_01.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportBackupJSON() {
  const list = getSubmissions();
  const blob = new Blob([JSON.stringify(list, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Du_Lieu_Bai_Nop_Toan10.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importBackupJSON(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const imported = JSON.parse(ev.target.result);
      if (Array.isArray(imported)) {
        saveSubmissionsLocal(imported);
        renderSubmissionsTable();
        alert(`Đã nhập thành công ${imported.length} bài làm của học sinh!`);
      }
    } catch (err) {
      alert('Tệp JSON không hợp lệ!');
    }
  };
  reader.readAsText(file);
}

function handleUploadExamFile(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const fileObj = {
        name: file.name,
        type: file.type,
        dataUrl: ev.target.result
      };
      localStorage.setItem(STORAGE_KEYS.ATTACHED_FILE, JSON.stringify(fileObj));
      document.getElementById('uploadedFileStatus').textContent = `✅ Đã đính kèm: ${file.name}`;
      renderExamQuestions();
    } catch (err) {
      alert('File quá lớn để lưu cục bộ (vui lòng chọn file dưới 3MB)!');
    }
  };
  reader.readAsDataURL(file);
}

function removeUploadedExamFile() {
  localStorage.removeItem(STORAGE_KEYS.ATTACHED_FILE);
  document.getElementById('uploadedFileStatus').textContent = 'Đã xóa file đính kèm.';
  document.getElementById('pdfUploadInput').value = '';
  renderExamQuestions();
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function exportStandaloneStudentFile() {
  try {
    const cssText = Array.from(document.styleSheets)
      .filter(s => !s.href || s.href.includes('style.css'))
      .map(s => {
        try {
          return Array.from(s.cssRules).map(r => r.cssText).join('\n');
        } catch (e) {
          return '';
        }
      }).join('\n');

    const resJs = await fetch('app.js').catch(() => null);
    const jsText = resJs && resJs.ok ? await resJs.text() : '';
    const resHtml = await fetch('index.html').catch(() => null);
    let htmlText = resHtml && resHtml.ok ? await resHtml.text() : document.documentElement.outerHTML;

    if (cssText) {
      htmlText = htmlText.replace('<link rel="stylesheet" href="style.css" />', `<style>\n${cssText}\n</style>`);
    }
    if (jsText) {
      htmlText = htmlText.replace('<script src="app.js"></script>', `<script>\n${jsText}\n</script>`);
    }

    const blob = new Blob([htmlText], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'De_Thi_Gui_Hoc_Sinh.html';
    a.click();
    URL.revokeObjectURL(url);
  } catch (e) {
    alert('Thầy/cô có thể sử dụng trực tiếp file De_Thi_Gui_Hoc_Sinh.html đã có sẵn trong thư mục!');
  }
}
