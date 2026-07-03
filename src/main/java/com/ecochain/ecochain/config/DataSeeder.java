package com.ecochain.ecochain.config;

import com.ecochain.ecochain.entity.Complaint;
import com.ecochain.ecochain.entity.PickupRequest;
import com.ecochain.ecochain.entity.Schedule;
import com.ecochain.ecochain.entity.User;
import com.ecochain.ecochain.repository.ComplaintRepository;
import com.ecochain.ecochain.repository.PickupRequestRepository;
import com.ecochain.ecochain.repository.ScheduleRepository;
import com.ecochain.ecochain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ScheduleRepository scheduleRepository;
    private final PickupRequestRepository pickupRequestRepository;
    private final ComplaintRepository complaintRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already seeded. Skipping...");
            return;
        }

        log.info("Seeding database with initial data...");

        // ── Admin User ──────────────────────────────────────────
        User admin = userRepository.save(User.builder()
                .name("Admin EcoChain")
                .email("admin@ecochain.com")
                .password(passwordEncoder.encode("admin123"))
                .phone("9000000001")
                .address("EcoChain HQ, Main Office")
                .role(User.Role.ADMIN)
                .build());

        // ── Citizen Users ────────────────────────────────────────
        User citizen1 = userRepository.save(User.builder()
                .name("Rahul Sharma")
                .email("rahul@gmail.com")
                .password(passwordEncoder.encode("citizen123"))
                .phone("9000000002")
                .address("12, MG Road, Pune")
                .role(User.Role.CITIZEN)
                .build());

        User citizen2 = userRepository.save(User.builder()
                .name("Priya Patel")
                .email("priya@gmail.com")
                .password(passwordEncoder.encode("citizen123"))
                .phone("9000000003")
                .address("45, Baner Road, Pune")
                .role(User.Role.CITIZEN)
                .build());

        User citizen3 = userRepository.save(User.builder()
                .name("Amit Kumar")
                .email("amit@gmail.com")
                .password(passwordEncoder.encode("citizen123"))
                .phone("9000000004")
                .address("78, Wakad, Pune")
                .role(User.Role.CITIZEN)
                .build());

        // ── Schedules ────────────────────────────────────────────
        Schedule schedule1 = scheduleRepository.save(Schedule.builder()
                .area("MG Road, Pune")
                .collectionDate(LocalDate.now().plusDays(2))
                .collectorName("Suresh Waste Services")
                .vehicleNumber("MH-12-AB-1234")
                .notes("Morning pickup 8AM - 11AM")
                .build());

        Schedule schedule2 = scheduleRepository.save(Schedule.builder()
                .area("Baner Road, Pune")
                .collectionDate(LocalDate.now().plusDays(3))
                .collectorName("GreenClean Services")
                .vehicleNumber("MH-12-CD-5678")
                .notes("Afternoon pickup 2PM - 5PM")
                .build());

        // ── Pickup Requests ──────────────────────────────────────
        PickupRequest req1 = pickupRequestRepository.save(PickupRequest.builder()
                .citizen(citizen1)
                .address("12, MG Road, Pune")
                .wasteType(PickupRequest.WasteType.GENERAL)
                .preferredDate(LocalDate.now().plusDays(2))
                .notes("Large bin full, please collect")
                .status(PickupRequest.RequestStatus.SCHEDULED)
                .schedule(schedule1)
                .build());

        PickupRequest req2 = pickupRequestRepository.save(PickupRequest.builder()
                .citizen(citizen2)
                .address("45, Baner Road, Pune")
                .wasteType(PickupRequest.WasteType.RECYCLABLE)
                .preferredDate(LocalDate.now().plusDays(3))
                .notes("Old newspapers and plastic bottles")
                .status(PickupRequest.RequestStatus.APPROVED)
                .build());

        PickupRequest req3 = pickupRequestRepository.save(PickupRequest.builder()
                .citizen(citizen3)
                .address("78, Wakad, Pune")
                .wasteType(PickupRequest.WasteType.ELECTRONIC)
                .preferredDate(LocalDate.now().plusDays(5))
                .notes("Old TV and laptop for disposal")
                .status(PickupRequest.RequestStatus.PENDING)
                .build());

        PickupRequest req4 = pickupRequestRepository.save(PickupRequest.builder()
                .citizen(citizen1)
                .address("12, MG Road, Pune")
                .wasteType(PickupRequest.WasteType.ORGANIC)
                .preferredDate(LocalDate.now().minusDays(3))
                .notes("Kitchen waste")
                .status(PickupRequest.RequestStatus.COLLECTED)
                .build());

        // ── Complaints ───────────────────────────────────────────
        complaintRepository.save(Complaint.builder()
                .citizen(citizen1)
                .pickupRequest(req1)
                .subject("Pickup was delayed by 2 days")
                .description("My scheduled pickup was supposed to happen on Monday but the truck came on Wednesday without any notice.")
                .status(Complaint.ComplaintStatus.OPEN)
                .build());

        complaintRepository.save(Complaint.builder()
                .citizen(citizen2)
                .subject("Collector was rude")
                .description("The waste collector was very rude when I asked about the recyclable waste sorting process.")
                .status(Complaint.ComplaintStatus.UNDER_REVIEW)
                .adminResponse("We are looking into this matter and will take appropriate action.")
                .build());

        log.info("✅ Database seeded successfully!");
        log.info("──────────────────────────────────────────");
        log.info("  Admin Login  → admin@ecochain.com / admin123");
        log.info("  Citizen 1   → rahul@gmail.com / citizen123");
        log.info("  Citizen 2   → priya@gmail.com / citizen123");
        log.info("  Citizen 3   → amit@gmail.com  / citizen123");
        log.info("  H2 Console  → http://localhost:8080/h2-console");
        log.info("──────────────────────────────────────────");
    }
}
