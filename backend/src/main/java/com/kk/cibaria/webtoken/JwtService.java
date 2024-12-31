package com.kk.cibaria.webtoken;

import java.time.Instant;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import javax.crypto.SecretKey;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

  private static final String SECRET = "00D7D1B0189D1A3B72573743AD62854F8034E9321D4E8ED5457840E63E4A7BCC0AEE6B3720C6DA46C40BA0D41E46206FF9FDE805A1C18403539B19BAFD45AEFE";
  private static final long EXPIRATIONTIME = TimeUnit.MINUTES.toMillis(30);

  public String generateToken(UserDetails userDetails) {
    Map<String, String> claims = new HashMap<>();
    claims.put("provider", "kkBackendTeam");
    return Jwts.builder()
        .claims(claims)
        .subject(userDetails.getUsername())
        .issuedAt(Date.from(Instant.now()))
        .expiration(Date.from(Instant.now().plusMillis(EXPIRATIONTIME)))
        .signWith(generateKey())
        .compact();
  }

  public SecretKey generateKey() {
    byte[] key = Base64.getDecoder().decode(SECRET);
    return Keys.hmacShaKeyFor(key);
  }

  public String extractUsername(String jwt) {
    Claims claims = getClaims(jwt);
    return claims.getSubject();
  }

  private Claims getClaims(String jwt) {
    Claims claims = Jwts.parser()
        .verifyWith(generateKey())
        .build()
        .parseSignedClaims(jwt)
        .getPayload();
    return claims;
  }

  public boolean isTokenValid(String jwt) {
    Claims claims = getClaims(jwt);
    return claims.getExpiration().after(Date.from(Instant.now()));
  }

}
