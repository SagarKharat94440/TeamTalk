package com.substring.chat.controller;

import com.substring.chat.model.Message;
import com.substring.chat.model.room;
import com.substring.chat.payload.MessageRequest;
import com.substring.chat.repositry.RoomRepository;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDateTime;

@Controller
@CrossOrigin("http://localhost:5173")
public class chatController {
    private RoomRepository roomRepository;

    public  chatController(RoomRepository roomRepository){
        this.roomRepository=roomRepository;
    }

    @MessageMapping("/sendMessage/{roomId}")
    @SendTo("/topic/room/{roomId}")
    public Message sendMessage(@DestinationVariable String roomId,
            @RequestBody MessageRequest request){
        room room1=roomRepository.findByRoomId(request.getRoomId());

        Message message= new Message(request.getSender(),request.getContent());
        message.setTimeStamp(LocalDateTime.now());

        if(room1!=null){
            room1.getMessages().add(message);
            roomRepository.save(room1);
        }else {
            throw new RuntimeException("room not found !!");
        }

        return  message;

    }
}
