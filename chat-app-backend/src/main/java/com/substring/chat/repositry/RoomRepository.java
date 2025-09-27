package com.substring.chat.repositry;

import com.substring.chat.model.room;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RoomRepository extends MongoRepository<room,String> {
    room findByRoomId(String roomId);
}
