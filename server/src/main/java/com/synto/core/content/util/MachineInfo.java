package com.synto.core.content.util;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class MachineInfo {
    String cpusn;
    String mainboard;
    String disk;
    String mac;

}
