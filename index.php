<?php
// PHP Variables for dynamic content (Setting up the structure)
$pageTitle = "จอมบึง มาราธอน | Chombueng Marathon";
$navItems = [
    "home" => "หน้าหลัก",
    "about" => "เกี่ยวกับเรา",
    "race_info" => "ข้อมูลการแข่งขัน",
    "register" => "สมัครวิ่ง",
    "contact" => "ติดต่อเรา"
];
?>
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($pageTitle) ?></title>
    <!-- Importing Google Fonts for Modern Typography -->
    <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <!-- Navigation Bar -->
    <nav class="navbar">
        <div class="container nav-container">
            <div class="logo">
                <h1>จอมบึง มาราธอน</h1>
            </div>
            <ul class="nav-links">
                <?php foreach($navItems as $key => $label): ?>
                    <li><a href="#<?= htmlspecialchars($key) ?>"><?= htmlspecialchars($label) ?></a></li>
                <?php endforeach; ?>
            </ul>
            <div class="mobile-menu-btn">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <header id="home" class="hero">
        <div class="hero-content">
            <span class="badge">งานวิ่งระดับตำนานของไทย</span>
            <h1 class="hero-title">CHOMBUENG<br>MARATHON 2026</h1>
            <p class="hero-subtitle">ประเพณี งานวิ่งเพื่อชาวจอมบึง และนักวิ่งทั่วประเทศ</p>
            <div class="hero-actions">
                <a href="#register" class="btn btn-primary">สมัครเข้าร่วมการแข่งขัน</a>
                <a href="#race_info" class="btn btn-secondary">ดูรายละเอียดงาน</a>
            </div>
        </div>
        <div class="hero-overlay"></div>
    </header>

    <!-- Info Section (Placeholder for structure) -->
    <section id="about" class="info-section">
        <div class="container">
            <div class="section-header text-center">
                <h2>เตรียมความพร้อมสู่จอมบึง</h2>
                <p>เรื่องราวและตำนานกว่าทศวรรษของการวิ่งที่เต็มไปด้วยสปิริต</p>
            </div>
            <div class="grid-3">
                <div class="card">
                    <div class="card-icon">🏃‍♂️</div>
                    <h3>มาราธอน 42.195 กม.</h3>
                    <p>เส้นทางวิ่งที่คลาสสิก อากาศบริสุทธิ์ ท้าทายความแข็งแกร่งของร่างกายและจิตใจ</p>
                </div>
                <div class="card">
                    <div class="card-icon">🏃‍♀️</div>
                    <h3>ฮาล์ฟมาราธอน 21.1 กม.</h3>
                    <p>ระยะยอดนิยม สำหรับนักวิ่งที่ต้องการก้าวข้ามขีดจำกัดของตัวเอง</p>
                </div>
                <div class="card">
                    <div class="card-icon">👟</div>
                    <h3>มินิมาราธอน 10 กม.</h3>
                    <p>ระยะเริ่มต้นที่ชวนเพื่อนๆ และครอบครัวมาร่วมสร้างสุขภาพที่ดีไปด้วยกัน</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer id="contact" class="footer">
        <div class="container footer-content">
            <div class="footer-brand">
                <h2>จอมบึง มาราธอน</h2>
                <p>ร่วมเป็นส่วนหนึ่งในตำนานของงานวิ่งแห่งความภาคภูมิใจ</p>
            </div>
            <div class="footer-links">
                <h3>ลิงก์ด่วน</h3>
                <ul>
                    <li><a href="#home">หน้าหลัก</a></li>
                    <li><a href="#about">เกี่ยวกับเรา</a></li>
                    <li><a href="#register">การรับสมัคร</a></li>
                </ul>
            </div>
            <div class="footer-contact">
                <h3>ติดต่อเรา</h3>
                <p>มหาวิทยาลัยราชภัฏหมู่บ้านจอมบึง<br>จ.ราชบุรี 70150</p>
                <p>Email: info@chombuengmarathon.com</p>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; <?= date("Y") ?> Chombueng Marathon. All rights reserved.</p>
        </div>
    </footer>

</body>
</html>
