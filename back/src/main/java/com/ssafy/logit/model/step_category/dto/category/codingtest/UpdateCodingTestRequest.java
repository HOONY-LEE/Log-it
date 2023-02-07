package com.ssafy.logit.model.step_category.dto.category.codingtest;

import com.ssafy.logit.model.step_category.entity.category.AlgoCategory;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import javax.validation.constraints.Max;
import javax.validation.constraints.NotNull;

@Data
@Schema(description = "코테 수정 요청")
public class UpdateCodingTestRequest {
    @NotNull
    private Long codingTestId;
    @Max(1000)
    private String algoContent;
    @Max(30)
    private AlgoCategory algoCategory;
}
