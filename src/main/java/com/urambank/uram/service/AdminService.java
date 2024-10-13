package com.urambank.uram.service;

import com.urambank.uram.dto.UserDTO;
import com.urambank.uram.entities.User;
import com.urambank.uram.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;


@Service
public class AdminService {


//    private final ProductRepository productRepository;
//    private final UserRepository userRepository;
//
//    public AdminService(ProductRepository productRepository, UserRepository userRepository) {
//        this.productRepository = productRepository;
//        this.userRepository = userRepository;
//    }
//
//    // DTO -> Entity 변환 메서드
//    private User convertToEntity(UserDTO userDTO) {
//        if (userDTO == null) {
//            return null;
//        }
//        User user = new User();
//        user.setUserNo(userDTO.getUserNo());
//        user.setUserId(userDTO.getUserId());
//        user.setName(userDTO.getName());
//        user.setUserPw(userDTO.getUserPw());
//        user.setUserRole(userDTO.getUSER_ROLE()); // 권한 추가
//        user.setState(userDTO.getState()); // 상태 추가
//        return user;
//    }
//
//    // Entity -> DTO 변환 메서드
//    private UserDTO convertToDTO(User user) {
//        if (user == null) {
//            return null;
//        }
//        UserDTO userDTO = new UserDTO();
//        userDTO.setUserNo(user.getUserNo());
//        userDTO.setUserId(user.getUserId());
//        userDTO.setName(user.getName());
//        userDTO.setUserPw(user.getUserPw());
//        userDTO.setUSER_ROLE(user.getUserRole()); // 권한 추가
//        userDTO.setState(user.getState()); // 상태 추가
//        userDTO.setResidentNumber(user.getResidentNumber());
//        userDTO.setEmail(user.getEmail());
//        userDTO.setHp(user.getHp());
//        userDTO.setAddress(user.getAddress());
//        userDTO.setBirth(user.getBirth());
//        return userDTO;
//    }
//
//    // 모든 상품 조회 ('y' 상태인 상품만 반환)
//    public List<ProductDTO> getAllProducts() {
//        List<ProductEntity> products = productRepository.findAll()
//                .stream()
//                .filter(product -> "y".equals(product.getViewState()))
//                .collect(Collectors.toList());
//
//        return products.stream()
//                .map(this::convertToProductDTO)
//                .collect(Collectors.toList());
//    }
//
//    // 특정 카테고리와 'y' 상태인 상품 목록 조회
//    public List<ProductDTO> getProductsByCategory(String category) {
//        List<ProductEntity> products = productRepository.findByProductCategoryAndViewState(category, "y");
//        return products.stream()
//                .map(this::convertToProductDTO)
//                .collect(Collectors.toList());
//    }
//
//    // 금융 상품 카테고리 별 개수 계산
//    public int countProductsByCategory(String category) {
//        return productRepository.countByProductCategoryAndViewState(category, "y");
//    }
//
//    // 상품 등록
//    public ProductDTO addProduct(ProductDTO productDTO) {
//        ProductEntity productEntity = convertToProductEntity(productDTO);
//        productEntity.setViewState("y");
//        ProductEntity savedProduct = productRepository.save(productEntity);
//        return convertToProductDTO(savedProduct);
//    }
//
//    // 상품 수정
//    public ProductDTO updateProduct(int productNo, ProductDTO productDTO) {
//        ProductEntity productEntity = productRepository.findById(productNo);
//
//        productEntity.setProductName(productDTO.getProductName());
//        productEntity.setProductCategory(productDTO.getProductCategory());
//        productEntity.setProductRate(productDTO.getProductRate());
//        productEntity.setProductContent(productDTO.getProductContent());
//        productEntity.setProductIMG(productDTO.getProductIMG());
//        productEntity.setViewState(productDTO.getViewState());
//
//        ProductEntity updatedProduct = productRepository.save(productEntity);
//        return convertToProductDTO(updatedProduct);
//    }
//
//    // 상품 상태 변경
//    public void updateViewState(int productNo, String viewState) {
//        ProductEntity product = productRepository.findById(productNo);
//        product.setViewState(viewState);
//        productRepository.save(product);
//    }
//
//    // Entity -> DTO 변환
//    private ProductDTO convertToProductDTO(ProductEntity productEntity) {
//        return ProductDTO.builder()
//                .productNo(productEntity.getProductNo())
//                .productName(productEntity.getProductName())
//                .productCategory(productEntity.getProductCategory())
//                .productRate(productEntity.getProductRate())
//                .productContent(productEntity.getProductContent())
//                .productIMG(productEntity.getProductIMG())
//                .viewState(productEntity.getViewState())
//                .build();
//    }
//
//    // DTO -> Entity 변환
//    private ProductEntity convertToProductEntity(ProductDTO productDTO) {
//        ProductEntity entity = new ProductEntity();
//        entity.setProductNo(productDTO.getProductNo());
//        entity.setProductName(productDTO.getProductName());
//        entity.setProductCategory(productDTO.getProductCategory());
//        return entity;
//    }
//
//    // 활성 회원 목록 조회 (NORMAL, STOP 상태의 유저를 조회)
//    public List<UserDTO> getAllUsers() {
//        List<User> normalUsers = userRepository.findAllByStateAndUserRole('y',"ROLE_USER");
//        List<User> stopUsers = userRepository.findAllByStateAndUserRole('n',"ROLE_USER");
//
//        // 두 리스트를 합친 후 DTO로 변환
//        return Stream.concat(normalUsers.stream(), stopUsers.stream())
//                .map(this::convertToDTO)
//                .collect(Collectors.toList());
//    }
//
//    // 탈퇴된 회원 조회 (END 상태의 유저만 조회)
//    public List<UserDTO> getRetiredUsers() {
//        return userRepository.findAllByStateAndUserRole('e',"ROLE_USER").stream()
//                .map(this::convertToDTO)
//                .collect(Collectors.toList());
//    }
//
//    // 회원 정보 수정 (DTO 사용, 내부에서 Entity 사용)
//    public UserDTO updateUser(int userNo, UserDTO userDTO) {
//        User userEntity = userRepository.findById(userNo)
//                .orElseThrow(() -> new RuntimeException("회원이 존재하지 않습니다."));
//
//        // 비밀번호가 null이 아닌 경우에만 업데이트
//        if (userDTO.getUserPw() != null && !userDTO.getUserPw().isEmpty()) {
//            userEntity.setUserPw(userDTO.getUserPw());
//        }
//
//        // 다른 필드 업데이트
//        userEntity.setUserId(userDTO.getUserId());
//        userEntity.setEmail(userDTO.getEmail());
//        userEntity.setName(userDTO.getName());
//        userEntity.setResidentNumber(userDTO.getResidentNumber());
//        userEntity.setOCRCheck(userDTO.getOCRCheck());
//        userEntity.setBirth(userDTO.getBirth());
//        userEntity.setHp(userDTO.getHp());
//        userEntity.setAddress(userDTO.getAddress());
//        userEntity.setState(userDTO.getState());
//
//        User updatedEntity = userRepository.save(userEntity);
//        return convertToDTO(updatedEntity);
//    }
//
//    // 회원 탈퇴 처리 (state를 'END'로 변경)
//    public void deactivateUser(int userNo) {
//        User userEntity = userRepository.findById(userNo)
//                .orElseThrow(() -> new RuntimeException("회원이 존재하지 않습니다."));
//        userEntity.setState('e'); // 상태를 '탈퇴'가 아닌 'END'로 변경
//        userRepository.save(userEntity);
//    }
//
//    public void setState(int userNo, char userState) {
//        User userEntity = userRepository.findById(userNo)
//                .orElseThrow(() -> new RuntimeException("회원이 존재하지 않습니다."));
//        userEntity.setState(userState); // 상태를 '정상'가 아닌 '정지'로 변경
//        userRepository.save(userEntity);
//    }
}
